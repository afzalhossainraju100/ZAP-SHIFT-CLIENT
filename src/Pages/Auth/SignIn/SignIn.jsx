import { NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuth from "../../../Hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import SocialLogIn from "../SocialLogIn/SocialLogIn";

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signInUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  console.log("in the log in page", location);

  const handleSignIn = (data) => {
    console.log("SignIn data:", data);
    signInUser(data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User signed in successfully:", user);

        // Redirect to intended page or home
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      })
      .catch((error) => {
        console.error("Error during sign in:", error);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 ">
      <div className="w-105 max-w-full bg-white rounded-2xl shadow-lg p-10">
        <h1 className="text-4xl font-extrabold leading-tight">Welcome Back</h1>
        <div className="text-gray-500 mt-2 mb-6">Login with ZapShift</div>

        <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Email</label>
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
              className="w-full p-3 rounded-lg border border-gray-200 placeholder-gray-400 mb-0 focus:outline-none focus:ring-2 focus:ring-lime-200"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
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
              className="w-full p-3 rounded-lg border border-gray-200 placeholder-gray-400 mb-0 focus:outline-none focus:ring-2 focus:ring-lime-200"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <a href="#" className="text-sm text-gray-500 underline">
              Forget Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-lime-400 hover:bg-lime-500 rounded-lg font-semibold text-gray-900 shadow-sm transition"
          >
            Login
          </button>
        </form>

        <div className="text-gray-500 mt-3 text-sm">
          {"Don't have any account?"}
          <NavLink to="/signup" className="text-green-600 ml-2 font-semibold">
            Register
          </NavLink>
        </div>

        <div className="text-center text-gray-500 my-4">Or</div>

        <div>
          <SocialLogIn></SocialLogIn>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
