import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home/Home";
import Coverage from "../Pages/Coverage/Coverage";
import About from "../Pages/About/About";
import Error from "../Pages/Error/Error";
import SignIn from "../Pages/Auth/SignIn/SignIn";
import SignUp from "../Pages/Auth/SignUp/SignUp";
import AuthLayOut from "../Layouts/AuthLayOut";
import Rider from "../Pages/Rider/Rider";
import PrivateRoute from "./PrivateRoute";
import ForgetPassword from "../Pages/Auth/ForgetPassword/ForgetPassword";
import { Navigate } from "react-router-dom";
import SendParcel from "../Pages/SendParcel/SendParcel";
import DashboardLayOut from "../Layouts/DashboardLayOut";
import MyParcels from "../Pages/Dashboard/MyParcels/MyParcels";
import Payment from "../Pages/Dashboard/Payment/Payment";
import PaymentSuccess from "../Pages/Dashboard/Payment/PaymentSuccess";
import PaymentCancelled from "../Pages/Dashboard/Payment/PaymentCancelled";
import PaymentHistory from "../Pages/Dashboard/PaymentHistory/PaymentHistory";
import DashboardHome from "../Pages/Dashboard/DashboardHome/DashboardHome";
import ParcelDetails from "../Pages/Dashboard/ParcelDetails/ParcelDetails";
import TrackParcel from "../Pages/Dashboard/Tracking/TrackParcel";
import Settings from "../Pages/Dashboard/Settings/Settings";
import ManageUsers from "../Pages/Dashboard/Admin/ManageUsers";
import ManageRiders from "../Pages/Dashboard/Admin/ManageRiders";
import DeliveryManagement from "../Pages/Dashboard/Admin/DeliveryManagement";
import ManageParcelDelivery from "../Pages/Dashboard/Admin/ManageParcelDelivery";
import RiderParcels from "../Pages/Dashboard/Rider/RiderParcels";
import { AdminRoute, RiderRoute } from "./RoleRoute";

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
      {
        path: "rider",
        element: (
          <PrivateRoute>
            <Rider />
          </PrivateRoute>
        ),
      },
      {
        path: "send-parcel",
        element: (
          <PrivateRoute>
            <SendParcel />
          </PrivateRoute>
        ),
      },
      {
        path: "payment-success",
        element: <Navigate to="/dashboard/payment-success" replace />,
      },
      {
        path: "payment-cancelled",
        element: <Navigate to="/dashboard/payment-cancelled" replace />,
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayOut,
    children: [
      {
        path: "signin",
        Component: SignIn,
      },
      {
        path: "signup",
        Component: SignUp,
      },
      {
        path: "forget-password",
        Component: ForgetPassword,
      },
      {
        path: "enter-code",
        element: <Navigate to="/forget-password" replace />,
      },
      {
        path: "reset-password",
        element: <Navigate to="/forget-password" replace />,
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayOut />
      </PrivateRoute>
    ),
    children: [
      // Shared (every role)
      {
        index: true,
        Component: DashboardHome,
      },
      {
        path: "parcel/:id",
        Component: ParcelDetails,
      },
      {
        path: "settings",
        Component: Settings,
      },
      {
        path: "payment-history",
        Component: PaymentHistory,
      },

      // User
      {
        path: "my-parcels",
        Component: MyParcels,
      },
      {
        path: "track",
        Component: TrackParcel,
      },
      {
        path: "payment/:parcelId",
        Component: Payment,
      },
      {
        path: "payment-success",
        Component: PaymentSuccess,
      },
      {
        path: "payment-cancelled",
        Component: PaymentCancelled,
      },

      // Admin only
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: "manage-riders",
        element: (
          <AdminRoute>
            <ManageRiders />
          </AdminRoute>
        ),
      },
      {
        path: "delivery-management",
        element: (
          <AdminRoute>
            <DeliveryManagement />
          </AdminRoute>
        ),
      },
      {
        path: "manage-parcel/:id",
        element: (
          <AdminRoute>
            <ManageParcelDelivery />
          </AdminRoute>
        ),
      },

      // Rider only
      {
        path: "pending-pickups",
        element: (
          <RiderRoute>
            <RiderParcels type="pickup" key="pickup" />
          </RiderRoute>
        ),
      },
      {
        path: "pending-deliveries",
        element: (
          <RiderRoute>
            <RiderParcels type="delivery" key="delivery" />
          </RiderRoute>
        ),
      },
      {
        path: "completed-deliveries",
        element: (
          <RiderRoute>
            <RiderParcels type="completed" key="completed" />
          </RiderRoute>
        ),
      },
    ],
  },
]);
