import { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../Hooks/useAuth";

const ForgetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { handleSendPasswordResetEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleForgetPassword = async (data) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      console.log("Sending password reset email to:", data.email);

      // Send password reset email via Firebase
      await handleSendPasswordResetEmail(data.email);

      setSuccessMessage(
        "Password reset email sent successfully! Check your email for the reset link.",
      );
      reset();
      console.log("Password reset email sent successfully");
    } catch (error) {
      console.error("Error sending password reset email:", error);

      // Handle specific error messages
      if (error.code === "auth/user-not-found") {
        setErrorMessage("No account found with this email address.");
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("Please enter a valid email address.");
      } else {
        setErrorMessage(
          error.message || "Failed to send reset email. Please try again.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-10">
        {/* Title */}
        <h1 className="text-4xl font-extrabold leading-tight mb-3">
          Forgot Password
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 text-base mb-8">
          Enter your email address and we'll send you a reset link.
        </p>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleForgetPassword)}
          className="space-y-6"
        >
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Please enter a valid email",
                },
              })}
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={isLoading || successMessage}
            className="w-full py-3 bg-lime-400 hover:bg-lime-500 disabled:bg-lime-300 disabled:cursor-not-allowed rounded-lg font-semibold text-gray-900 shadow-sm transition-colors"
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Remember your password?
          <a
            href="/signin"
            className="ml-1 font-semibold text-lime-600 hover:text-lime-700 transition"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
