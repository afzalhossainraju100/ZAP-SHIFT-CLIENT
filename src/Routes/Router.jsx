import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home/Home";
import Coverage from "../Pages/Coverage/Coverage";
import About from "../Pages/About/About";
import Error from "../Pages/Error/Error";
import SignIn from "../Pages/Auth/SignIn/SignIn";
import SignUp from "../Pages/Auth/SignUp/SignUp";
import AuthLayOut from "../Layouts/AuthLayOut";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "coverage",
        Component: Coverage,
        loader: () => fetch("/serviceCenter.json").then((res) => res.json()),
      },
      {
        path: "about",
        Component: About,
      },
      {
        path: "services",
        Component: Error,
      },
    ],
  },
  {
    path: '/',
    Component: AuthLayOut,
    children: [
      {
        path: 'signin',
        Component: SignIn,
      },
      {
        path: 'signup',
        Component: SignUp,
      }
    ]
  }
]);
