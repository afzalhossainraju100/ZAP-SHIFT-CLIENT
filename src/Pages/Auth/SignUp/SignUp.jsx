import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";
import { useNavigate } from "react-router-dom";
import SocialLogIn from "../SocialLogIn/SocialLogIn";
import axios from "axios";
import { useLocation } from "react-router-dom";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signUpUser, updateUserProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  console.log("in the registration page", location);

  const handleRegistration = (data) => {
    console.log("Registration data:", data);
    console.log("Selected photo file:", data.photo[0]);
    const profileimg = data.photo[0];

    signUpUser(data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        //update the image
        //1. store the image in form
        const formData = new FormData();
        formData.append("image", profileimg);
//send the photo to store and get the ul
        const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_img_host_key}`;
//update user profile to firebase
        axios
          .post(image_API_URL, formData)
          .then((response) => {
            const imageUrl = response.data.data.url;
            console.log("Image uploaded successfully:", imageUrl);
            // Here you can update the user's profile with the image URL
            const userProfile = {
              displayName: data.name,
              photoURL: imageUrl,
            };

            //send to the firebase
            updateUserProfile(userProfile)
              .then(() => {
                console.log("User profile updated successfully");
                navigate("/", { replace: true });
              })
              .catch((error) => {
                console.error("Error updating user profile:", error);
              });
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
          });

        //update user profile
        console.log("User registered successfully:", user);
      })
      .catch((error) => {
        console.error("Error during registration:", error);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-105 max-w-full bg-white rounded-2xl shadow-lg p-10">
        <h1 className="text-4xl font-extrabold leading-tight text-start">
          Create an Account
        </h1>
        <div className="text-gray-500 mt-2 mb-6 text-start">
          Register with ZapShift
        </div>

        <form onSubmit={handleSubmit(handleRegistration)}>
          {/* file image input */}
          <label className="block text-sm text-gray-700 mb-2">
            Upload Photo
          </label>
          <input
            type="file"
            accept="image/*"
            className="w-full p-3 rounded-lg border border-gray-200 placeholder-gray-400 mb-4 focus:outline-none focus:ring-2 focus:ring-lime-200"
            {...register("photo", { required: "Photo is required" })}
          />
          {errors.photo && (
            <p className="-mt-2 mb-4 text-sm text-red-500">
              {errors.photo.message}
            </p>
          )}

          <label className="block text-sm text-gray-700 mb-2">Name</label>
          <input
            type="text"
            placeholder="Name"
            className="w-full p-3 rounded-lg border border-gray-200 placeholder-gray-400 mb-4 focus:outline-none focus:ring-2 focus:ring-lime-200"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="-mt-2 mb-4 text-sm text-red-500">
              {errors.name.message}
            </p>
          )}

          <label className="block text-sm text-gray-700 mb-2">Email</label>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg border border-gray-200 placeholder-gray-400 mb-4 focus:outline-none focus:ring-2 focus:ring-lime-200"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Please enter a valid email",
              },
            })}
          />
          {errors.email && (
            <p className="-mt-2 mb-4 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}

          <label className="block text-sm text-gray-700 mb-2">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            placeholder="Password"
            className="w-full p-3 rounded-lg border border-gray-200 placeholder-gray-400 mb-4 focus:outline-none focus:ring-2 focus:ring-lime-200"
          />
          {errors.password && (
            <p className="-mt-2 mb-4 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-lime-400 hover:bg-lime-500 rounded-lg font-semibold text-gray-900 shadow-sm transition"
          >
            Register
          </button>
        </form>

        <div className="text-gray-500 mt-4 text-sm text-center">
          {"Already have an account?"}
          <NavLink to="/signin" className="text-green-600 ml-2 font-semibold"
          state = {location.state}>
            Login
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

export default SignUp;
