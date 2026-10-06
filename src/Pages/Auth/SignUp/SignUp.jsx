import { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FiUser } from "react-icons/fi";
import { MdOutlinePedalBike } from "react-icons/md";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import SocialLogIn from "../SocialLogIn/SocialLogIn";
import { getAuthErrorMessage } from "../../../utils/authErrors";

const inputClass =
  "w-full p-3 rounded-lg border border-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-200";

const accountTypes = [
  { value: "user", label: "Customer", hint: "Send & track parcels", icon: FiUser },
  { value: "rider", label: "Rider", hint: "Deliver & earn", icon: MdOutlinePedalBike },
];

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signUpUser, setFirebaseProfile, registerToServer, logOut } = useAuth();
  const axiosSecure = useAxiosSecure();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [accountType, setAccountType] = useState(
    searchParams.get("as") === "rider" || location.state?.accountType === "rider"
      ? "rider"
      : "user",
  );
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const afterRegister = () =>
    accountType === "rider"
      ? "/rider"
      : location.state?.from?.pathname || "/dashboard";

  // The email is already registered: send them to the login page
  const goToLogin = (email) => {
    Swal.fire({
      icon: "info",
      title: "You already have an account",
      text: `${email} is already registered. Please log in instead.`,
      confirmButtonText: "Go to Login",
      confirmButtonColor: "#84cc16",
    }).then(() =>
      navigate("/signin", { state: { ...location.state, email, reason: "exists" } }),
    );
  };

  const uploadPhoto = async (file) => {
    if (!file) return "";
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_img_host_key}`,
        formData,
      );
      return res.data.data.url;
    } catch (error) {
      // The account can still be created; the photo can be added later
      console.error("Photo upload failed:", error);
      return "";
    }
  };

  const handleRegistration = async (data) => {
    setSubmitting(true);
    setFormError("");
    const email = data.email.trim().toLowerCase();

    try {
      // 1. Never create the same user twice
      const check = await axiosSecure.post("/auth/check-email", { email });
      if (check.data.exists) {
        goToLogin(email);
        return;
      }

      const photoURL = await uploadPhoto(data.photo?.[0]);

      // 2. Firebase account
      try {
        await signUpUser(email, data.password);
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          goToLogin(email);
          return;
        }
        throw error;
      }
      await setFirebaseProfile({
        displayName: data.name.trim(),
        ...(photoURL ? { photoURL } : {}),
      });

      // 3. ZapShift profile in the database (role "user")
      try {
        await registerToServer({
          name: data.name.trim(),
          photoURL,
          phone: data.phone.trim(),
          gender: data.gender,
          accountType,
        });
      } catch (error) {
        if (error.response?.data?.code === "USER_EXISTS") {
          await logOut();
          goToLogin(email);
          return;
        }
        throw error;
      }

      await Swal.fire({
        icon: "success",
        title: "Account created!",
        text:
          accountType === "rider"
            ? "Next, fill in your rider application."
            : "Welcome to ZapShift.",
        timer: 1800,
        showConfirmButton: false,
      });
      navigate(afterRegister(), { replace: true });
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 text-black">
      <div className="w-105 max-w-full bg-white rounded-2xl shadow-lg p-10">
        <h1 className="text-4xl font-extrabold leading-tight text-start">
          Create an Account
        </h1>
        <div className="text-gray-500 mt-2 mb-6 text-start">
          Register with ZapShift
        </div>

        {/* Account type */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          {accountTypes.map(({ value, label, hint, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setAccountType(value)}
              className={`rounded-xl border-2 p-3 text-left transition ${
                accountType === value
                  ? "border-lime-400 bg-lime-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Icon className="mb-1 size-5 text-[#03373d]" />
              <p className="font-semibold">{label}</p>
              <p className="text-xs text-gray-500">{hint}</p>
            </button>
          ))}
        </div>
        {accountType === "rider" && (
          <p className="-mt-3 mb-5 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
            After creating your account you'll fill in the rider application.
            You become a rider once an admin approves it.
          </p>
        )}

        <form onSubmit={handleSubmit(handleRegistration)} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Upload Photo <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              className={inputClass}
              {...register("photo")}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              placeholder="Full Name"
              className={inputClass}
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="Email"
              className={inputClass}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/i,
                  message: "Please enter a valid email",
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                className={inputClass}
                {...register("phone", {
                  required: "Phone is required",
                  pattern: {
                    value: /^\+?[0-9][0-9\s-]{5,19}$/,
                    message: "Enter a valid phone number",
                  },
                })}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Gender</label>
              <select
                className={`${inputClass} bg-white`}
                {...register("gender", { required: "Select gender" })}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-500">{errors.gender.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="Password"
              className={inputClass}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)/,
                  message: "Use at least one letter and one number",
                },
              })}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {formError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-lime-400 hover:bg-lime-500 rounded-lg font-semibold text-gray-900 shadow-sm transition disabled:opacity-60"
          >
            {submitting
              ? "Creating account..."
              : accountType === "rider"
                ? "Register as Rider"
                : "Register"}
          </button>
        </form>

        <div className="text-gray-500 mt-4 text-sm text-center">
          {"Already have an account?"}
          <NavLink
            to="/signin"
            className="text-green-600 ml-2 font-semibold"
            state={location.state}
          >
            Login
          </NavLink>
        </div>

        <div className="text-center text-gray-500 my-4">Or</div>
        <div>
          <SocialLogIn mode="register" accountType={accountType} />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
