import useAuth from "../../../Hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const SocialLogIn = () => {
  const { signInGoogle } = useAuth();
  const location = useLocation();
  console.log("in the social log in page", location);
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    signInGoogle()
      .then((result) => {
        const user = result.user;
        console.log("User signed in with Google:", user);
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      })
      .catch((error) => {
        console.error("Error during Google sign-in:", error);
      });
  };
  return (
    <div>
      <button
        onClick={handleGoogleSignIn}
        className="w-full py-3 bg-white border border-gray-200 rounded-lg flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
      >
        <svg
          viewBox="0 0 533.5 544.3"
          className="w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            fill="#4285f4"
            d="M533.5 278.4c0-17.6-1.6-34.6-4.7-51.1H272v96.8h147.4c-6.3 34-25.1 62.8-53.6 82l86.5 67c50.5-46.6 81.2-115 81.2-194.7z"
          />
          <path
            fill="#34a853"
            d="M272 544.3c72.6 0 133.6-23.9 178.1-64.8l-86.5-67c-24 16.1-54.8 25.6-91.6 25.6-70.4 0-130-47.5-151.3-111.4l-89.7 69.1C60.9 472.6 157.7 544.3 272 544.3z"
          />
          <path
            fill="#fbbc04"
            d="M120.7 324.9c-8.6-25.6-8.6-53 0-78.6L31 177.2c-38.3 75.8-38.3 164 0 239.8l89.7-69.1z"
          />
          <path
            fill="#ea4335"
            d="M272 107.9c37.9-.6 74.6 13 102.5 37.6l76.9-76.9C405.3 23.6 344.3 0 272 0 157.7 0 60.9 71.7 31 177.2l89.7 69.1C142 155.4 201.6 107.9 272 107.9z"
          />
        </svg>
        <span className="text-sm">Register with Google</span>
      </button>
    </div>
  );
};

export default SocialLogIn;
