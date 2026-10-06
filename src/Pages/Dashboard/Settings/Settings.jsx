import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import useAuth from "../../../Hooks/useAuth";
import useRole from "../../../Hooks/useRole";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { getErrorMessage } from "../../../utils/parcelStatus";

const Settings = () => {
  const { user, updateUserProfile, handleSendPasswordResetEmail } = useAuth();
  const { role } = useRole();
  const axiosSecure = useAxiosSecure();
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: { name: user?.displayName || "" },
  });

  const { data: rider } = useQuery({
    queryKey: ["rider-me", user?.email],
    enabled: role === "rider",
    queryFn: async () => (await axiosSecure.get("/riders/me")).data.data,
  });

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const profile = { displayName: data.name.trim() };
      const file = data.photo?.[0];

      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        const res = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_img_host_key}`,
          formData,
        );
        profile.photoURL = res.data.data.url;
      }

      await updateUserProfile(profile);
      Swal.fire("Saved!", "Your profile was updated. Refresh to see it everywhere.", "success");
    } catch (error) {
      Swal.fire("Error!", getErrorMessage(error), "error");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = () => {
    handleSendPasswordResetEmail(user.email)
      .then(() =>
        Swal.fire("Email sent", `A password reset link was sent to ${user.email}.`, "success"),
      )
      .catch((error) => Swal.fire("Error!", getErrorMessage(error), "error"));
  };

  return (
    <div className="mt-20 grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input
              {...register("name", { required: true })}
              className="input w-full bg-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input value={user?.email || ""} readOnly className="input w-full bg-gray-100" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">New photo</label>
            <input
              type="file"
              accept="image/*"
              {...register("photo")}
              className="file-input w-full bg-white"
            />
          </div>
          <button
            disabled={saving}
            className="btn border-[#caeb66] bg-[#caeb66] text-black"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>

        <div className="mt-8 border-t border-gray-100 pt-6">
          <h2 className="font-semibold">Password</h2>
          <p className="mt-1 text-sm text-gray-500">
            We'll email you a secure link to set a new password.
          </p>
          <button onClick={handlePasswordReset} className="btn btn-sm mt-3">
            Send password reset email
          </button>
        </div>
      </div>

      {role === "rider" && rider && (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Rider Profile</h2>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            {[
              ["Phone", rider.phone],
              ["Service center", `${rider.district}, ${rider.region}`],
              ["NID", rider.nid],
              ["Driving license", rider.drivingLicense],
              ["Bike", rider.bikeModel],
              ["Registration", rider.bikeRegistration],
              ["Earnings", `৳${rider.earnings || 0}`],
              ["Tasks completed", rider.completedTasks || 0],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-gray-50 p-3">
                <dt className="text-xs text-gray-500">{label}</dt>
                <dd className="font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-gray-500">
            To change rider details, contact an admin.
          </p>
        </div>
      )}
    </div>
  );
};

export default Settings;
