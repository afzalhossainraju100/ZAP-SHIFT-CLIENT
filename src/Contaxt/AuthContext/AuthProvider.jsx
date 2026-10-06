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
import { useEffect, useState } from "react";
import { axiosSecure } from "../../Hooks/useAxiosSecure";

const GoogleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signUpUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, GoogleProvider);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  const updateUserProfile = (profile) => {
    if (!auth.currentUser)
      return Promise.reject(new Error("No authenticated user"));
    return updateProfile(auth.currentUser, profile).then(() =>
      saveUserToDatabase(profile),
    );
  };

  const handleSendPasswordResetEmail = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const handleResetPassword = (code, newPassword) => {
    return confirmPasswordReset(auth, code, newPassword);
  };

  // Save / refresh the user in the database so the server knows their role.
  // New users get the "user" role on the server.
  const saveUserToDatabase = (profile = {}) => {
    return axiosSecure.post("/users", {
      name: profile.displayName ?? auth.currentUser?.displayName ?? "",
      photoURL: profile.photoURL ?? auth.currentUser?.photoURL ?? "",
    });
  };

  //observe user state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          await saveUserToDatabase();
        } catch (error) {
          console.error("Could not sync user with the server:", error.message);
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
    updateUserProfile,
    handleSendPasswordResetEmail,
    handleResetPassword,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
