import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  confirmPasswordReset,
} from "firebase/auth";
import { auth } from "../../firebase/firebase.init";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { axiosSecure } from "../../Hooks/useAxiosSecure";
import { clearAdminSession } from "../../utils/adminSession";

const GoogleProvider = new GoogleAuthProvider();
GoogleProvider.setCustomParameters({ prompt: "select_account" });

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [, setProfileVersion] = useState(0);
  const sessionChecked = useRef(false);
  const queryClient = useQueryClient();

  const signUpUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInGoogle = () => {
    return signInWithPopup(auth, GoogleProvider);
  };

  const logOut = () => {
    clearAdminSession();
    queryClient.removeQueries();
    return signOut(auth);
  };

  // Only sets the Firebase display name / photo (used while registering,
  // before the database profile exists)
  const setFirebaseProfile = (profile) => {
    if (!auth.currentUser) return Promise.resolve();
    return updateProfile(auth.currentUser, profile);
  };

  // Profile page: Firebase name/photo + database profile (phone, gender, ...)
  const updateUserProfile = async ({ displayName, photoURL, phone, gender }) => {
    if (!auth.currentUser) throw new Error("No authenticated user");

    const firebaseUpdate = {};
    if (displayName !== undefined) firebaseUpdate.displayName = displayName;
    if (photoURL !== undefined) firebaseUpdate.photoURL = photoURL;
    if (Object.keys(firebaseUpdate).length) {
      await updateProfile(auth.currentUser, firebaseUpdate);
    }

    const res = await axiosSecure.patch("/users/me", {
      name: displayName,
      photoURL,
      phone,
      gender,
    });

    // updateProfile mutates the same user object, so force consumers
    // (navbar, sidebar, profile) to re-render with the new name/photo
    setProfileVersion((version) => version + 1);
    return res.data;
  };

  // Create the database profile for the signed in Firebase account.
  // Fails with code USER_EXISTS (409) if the profile already exists.
  const registerToServer = async (profile = {}) => {
    const res = await axiosSecure.post("/auth/register", profile);
    queryClient.invalidateQueries({ queryKey: ["auth-me"] });
    return res.data;
  };

  // Log the signed in Firebase account into ZapShift.
  // Fails with code USER_NOT_FOUND (404) unless createIfMissing is set.
  const loginToServer = async ({ createIfMissing = false, profile = {} } = {}) => {
    try {
      const res = await axiosSecure.post("/auth/login");
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
      return res.data;
    } catch (error) {
      if (createIfMissing && error.response?.data?.code === "USER_NOT_FOUND") {
        const data = await registerToServer(profile);
        return { ...data, created: true };
      }
      throw error;
    }
  };

  const handleSendPasswordResetEmail = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const handleResetPassword = (code, newPassword) => {
    return confirmPasswordReset(auth, code, newPassword);
  };

  //observe user state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // When the page loads with a saved Firebase session, only keep it if
      // the account really has a ZapShift profile. (Sign in / register pages
      // check this themselves, so later changes are skipped here.)
      if (!sessionChecked.current) {
        sessionChecked.current = true;

        if (currentUser) {
          try {
            const res = await axiosSecure.get("/auth/me");
            if (!res.data?.exists) {
              await signOut(auth);
              currentUser = null;
            }
          } catch (error) {
            console.error("Could not check the saved session:", error.message);
          }
        }
      }

      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    signUpUser,
    signInUser,
    signInGoogle,
    logOut,
    setFirebaseProfile,
    updateUserProfile,
    registerToServer,
    loginToServer,
    handleSendPasswordResetEmail,
    handleResetPassword,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
