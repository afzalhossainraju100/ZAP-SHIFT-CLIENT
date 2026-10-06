import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuth from "../../../Hooks/useAuth";
import SocialLogIn from "../SocialLogIn/SocialLogIn";
import { getAuthErrorMessage } from "../../../utils/authErrors";

const inputClass =
  "w-full p-3 rounded-lg border border-gray-200 placeholder-gray-400 mb-0 focus:outline-none focus:ring-2 focus:ring-lime-200";

const SignIn = () => {
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: location.state?.email || "" } });

  const { signInUser, loginToServer, logOut } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const from = location.state?.from?.pathname || "/";

  const handleSignIn = async (data) => {
    setSubmitting(true);
    setFormError("");
    let signedIn = false;

    try {
      const credential = await signInUser(data.email.trim(), data.password);
      signedIn = true;

      // An email/password Firebase account without a ZapShift profile (e.g.
      // registration was interrupted) gets its profile created here.
      const result = await loginToServer({
        createIfMissing: true,
        profile: { name: credential.user.displayName || "" },
      });

      if (result.adminOtpRequired) {
        navigate("/admin-verify", { state: { from: location.state?.from }, replace: true });
        return;
      }
      navigate(from, { replace: true });
    } catch (error) {
      if (signedIn) await logOut();
      setFormError(getAuthErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 text-black">
      <div className="w-105 max-w-full bg-white rounded-2xl shadow-lg p-10">
        <h1 className="text-4xl font-extrabold leading-tight">Welcome Back</h1>
        <div className="text-gray-500 mt-2 mb-6">Login with ZapShift</div>

        {location.state?.reason === "exists" && (
          <p className="mb-4 rounded-lg bg-lime-50 px-3 py-2 text-sm text-lime-800">
            This email already has an account. Log in to continue.
          </p>
        )}

        <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Email</label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/i,
                  message: "Please enter a valid email",
                },
              })}
              type="email"
              placeholder="Email"
              autoComplete="email"
              className={inputClass}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Password</label>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              className={inputClass}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="mb-4">
            <NavLink
              to="/forget-password"
              className="text-sm text-gray-500 underline hover:text-lime-400 transition"
            >
              Forget Password?
            </NavLink>
          </div>

          {formError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-lime-400 hover:bg-lime-500 rounded-lg font-semibold text-gray-900 shadow-sm transition disabled:opacity-60"
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-gray-500 mt-3 text-sm">
          {"Don't have any account?"}
          <NavLink
            to="/signup"
            className="text-green-600 ml-2 font-semibold"
            state={location.state}
          >
            Register
          </NavLink>
        </div>

        <div className="text-center text-gray-500 my-4">Or</div>

        <div>
          <SocialLogIn mode="login" />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
