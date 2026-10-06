import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FiCamera,
  FiCheckCircle,
  FiAlertCircle,
  FiMail,
  FiCalendar,
  FiClock,
  FiShield,
  FiPackage,
  FiTruck,
  FiCreditCard,
  FiMapPin,
  FiSend,
  FiUsers,
  FiLock,
  FiEdit2,
  FiPhone,
  FiUser,
  FiXCircle,
} from "react-icons/fi";
import { MdOutlinePedalBike } from "react-icons/md";
import useAuth from "../../../Hooks/useAuth";
import useRole from "../../../Hooks/useRole";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../Component/Loading/Loading";
import { formatDate, getErrorMessage } from "../../../utils/parcelStatus";

const roleStyles = {
  user: { label: "Customer", className: "bg-[#caeb66] text-[#03373d]" },
  rider: { label: "Rider", className: "bg-amber-300 text-amber-950" },
  admin: { label: "Admin", className: "bg-white text-[#03373d]" },
};

const quickActions = {
  user: [
    { to: "/send-parcel", label: "Send a parcel", icon: FiSend },
    { to: "/dashboard/my-parcels", label: "My parcels", icon: FiPackage },
    { to: "/dashboard/track", label: "Track a parcel", icon: FiMapPin },
    { to: "/dashboard/payment-history", label: "Payment history", icon: FiCreditCard },
  ],
  rider: [
    { to: "/dashboard/pending-pickups", label: "Parcels to pick up", icon: FiTruck },
    { to: "/dashboard/pending-deliveries", label: "Parcels to deliver", icon: MdOutlinePedalBike },
    { to: "/dashboard/completed-deliveries", label: "Completed deliveries", icon: FiCheckCircle },
  ],
  admin: [
    { to: "/dashboard/delivery-management", label: "Delivery management", icon: FiPackage },
    { to: "/dashboard/manage-riders", label: "Manage riders", icon: MdOutlinePedalBike },
    { to: "/dashboard/manage-users", label: "Manage users", icon: FiUsers },
  ],
};

const StatTile = ({ icon: Icon, label, value, hint }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#caeb66]/40 text-[#03373d]">
        <Icon className="size-5" />
      </span>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
    <p className="mt-3 text-2xl font-bold text-[#03373d]">{value}</p>
    {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
  </div>
);

const InfoRow = ({ icon: Icon, label, children }) => (
  <div className="flex items-start gap-3 border-b border-gray-100 py-3 last:border-0">
    <Icon className="mt-0.5 size-4 shrink-0 text-gray-400" />
    <div className="min-w-0 flex-1">
      <p className="text-xs text-gray-500">{label}</p>
      <div className="truncate text-sm font-medium">{children}</div>
    </div>
  </div>
);

const riderStatusStyles = {
  pending: {
    box: "border-amber-200 bg-amber-50 text-amber-900",
    icon: FiClock,
    title: "Rider application pending",
    text: "An admin is reviewing your application. You'll get rider access once it's approved.",
  },
  rejected: {
    box: "border-red-200 bg-red-50 text-red-900",
    icon: FiXCircle,
    title: "Rider application rejected",
    text: "Your application was not approved.",
  },
  approved: {
    box: "border-green-200 bg-green-50 text-green-900",
    icon: FiCheckCircle,
    title: "Rider application approved",
    text: "You are a ZapShift rider.",
  },
};

const RiderStatusCard = ({ status, district, appliedAt, reason }) => {
  const style = riderStatusStyles[status];
  if (!style) return null;
  const Icon = style.icon;

  return (
    <div className={`rounded-2xl border p-6 ${style.box}`}>
      <h2 className="flex items-center gap-2 font-bold">
        <Icon /> {style.title}
      </h2>
      <p className="mt-1 text-sm opacity-90">{style.text}</p>
      {status === "rejected" && reason && (
        <p className="mt-2 rounded-lg bg-white/70 p-3 text-sm">
          <span className="font-semibold">Reason:</span> {reason}
        </p>
      )}
      <p className="mt-2 text-xs opacity-75">
        {district ? `${district} service center · ` : ""}
        {appliedAt ? `Applied ${formatDate(appliedAt)}` : ""}
      </p>
      {status === "rejected" && (
        <Link to="/rider" className="btn btn-sm mt-3 border-red-300 bg-white text-red-700">
          <MdOutlinePedalBike /> Apply again
        </Link>
      )}
    </div>
  );
};

const Profile = () => {
  const { user, updateUserProfile, handleSendPasswordResetEmail } = useAuth();
  const { role, roleLoading } = useRole();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.email],
    queryFn: async () => (await axiosSecure.get("/users/me")).data.data,
  });

  // The form follows the saved profile once it has loaded
  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: { name: user?.displayName || "", phone: "", gender: "" },
    values: profile?.user
      ? {
          name: profile.user.name || user?.displayName || "",
          phone: profile.user.phone || "",
          gender: profile.user.gender || "",
        }
      : undefined,
    resetOptions: { keepDirtyValues: true },
  });
  const photoFile = useWatch({ control, name: "photo" });

  // Live preview of the selected photo before uploading it
  const selectedFile = photoFile?.[0];
  const preview = useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : null),
    [selectedFile],
  );
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  if (isLoading || roleLoading) return <Loading />;

  const stats = profile?.stats || {};
  const rider = profile?.rider;
  const riderStatus = profile?.user?.riderStatus || rider?.status || "none";
  const provider = user?.providerData?.[0]?.providerId;
  const isPasswordAccount = provider === "password";
  const roleStyle = roleStyles[role] || roleStyles.user;
  const avatar = preview || user?.photoURL;

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const update = {
        displayName: data.name.trim(),
        phone: data.phone.trim(),
        gender: data.gender,
      };
      const file = data.photo?.[0];

      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        const res = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_img_host_key}`,
          formData,
        );
        update.photoURL = res.data.data.url;
      }

      await updateUserProfile(update);
      reset({ name: update.displayName, phone: update.phone, gender: update.gender, photo: null });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      Swal.fire({
        icon: "success",
        title: "Profile updated",
        timer: 1500,
        showConfirmButton: false,
      });
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
    <div className="space-y-6">
      {/* Header banner */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="relative h-36 bg-linear-to-r from-[#03373d] via-[#0b5560] to-[#33929d]">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#caeb66]/20" />
          <div className="absolute bottom-0 right-24 h-24 w-24 rounded-full bg-white/10" />
        </div>
        <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end">
          <div className="-mt-14 shrink-0">
            {avatar ? (
              <img
                src={avatar}
                alt={user?.displayName || "Profile"}
                className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-[#caeb66] text-4xl font-bold uppercase text-[#03373d] shadow-lg">
                {(user?.displayName || user?.email || "?").charAt(0)}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-2xl font-bold text-[#03373d]">
                {user?.displayName || "Unnamed user"}
              </h1>
              <span
                className={`rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wider shadow-sm ring-1 ring-[#03373d]/20 ${roleStyle.className}`}
              >
                {roleStyle.label}
              </span>
            </div>
            <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
              <FiMail /> {user?.email}
              {user?.emailVerified ? (
                <span className="flex items-center gap-1 text-green-600">
                  <FiCheckCircle /> Verified
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-600">
                  <FiAlertCircle /> Not verified
                </span>
              )}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Member since {formatDate(profile?.user?.createdAt || user?.metadata?.creationTime)}
            </p>
          </div>
          <a href="#edit-profile" className="btn btn-sm border-[#caeb66] bg-[#caeb66] text-black">
            <FiEdit2 /> Edit profile
          </a>
        </div>
      </div>

      {/* Role specific stats */}
      {role === "rider" ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatTile icon={FiCreditCard} label="Total earnings" value={`৳${rider?.earnings || 0}`} hint="৳20 per pickup / delivery" />
          <StatTile icon={FiCheckCircle} label="Tasks completed" value={rider?.completedTasks || 0} />
          <StatTile icon={FiMapPin} label="Service center" value={rider?.district || "—"} hint={rider?.region} />
          <StatTile icon={FiShield} label="Rider status" value={<span className="capitalize">{rider?.status || "—"}</span>} hint={rider?.reviewedAt ? `Reviewed ${formatDate(rider.reviewedAt)}` : undefined} />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatTile icon={FiPackage} label="Parcels booked" value={stats.totalParcels || 0} />
          <StatTile icon={FiTruck} label="In progress" value={stats.inProgress || 0} hint={`${stats.unpaid || 0} waiting for payment`} />
          <StatTile icon={FiCheckCircle} label="Delivered" value={stats.delivered || 0} />
          <StatTile
            icon={FiCreditCard}
            label="Total spent"
            value={`৳${Number(stats.totalSpentBdt || 0).toLocaleString()}`}
            hint={stats.lastPaidAt ? `Last payment ${formatDate(stats.lastPaidAt)}` : "No payments yet"}
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-6">
          {/* Account details */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-lg font-bold">Account details</h2>
            <InfoRow icon={FiMail} label="Email">{user?.email}</InfoRow>
            <InfoRow icon={FiShield} label="Sign-in method">
              {provider === "google.com" ? "Google account" : "Email & password"}
            </InfoRow>
            <InfoRow icon={FiCalendar} label="Account created">
              {formatDate(user?.metadata?.creationTime)}
            </InfoRow>
            <InfoRow icon={FiClock} label="Last sign in">
              {formatDate(user?.metadata?.lastSignInTime)}
            </InfoRow>
            <InfoRow icon={FiPhone} label="Phone">
              {profile?.user?.phone || <span className="text-gray-400">Not added</span>}
            </InfoRow>
            <InfoRow icon={FiUser} label="Gender">
              <span className="capitalize">
                {profile?.user?.gender || <span className="text-gray-400">Not added</span>}
              </span>
            </InfoRow>
            <InfoRow icon={FiUsers} label="Role">
              <span className="capitalize">{role}</span>
            </InfoRow>
          </div>

          {/* Rider application status (pending / rejected) for customers */}
          {role === "user" && riderStatus !== "none" && (
            <RiderStatusCard
              status={riderStatus}
              district={rider?.district}
              appliedAt={rider?.appliedAt}
              reason={profile?.user?.riderRejectionReason || rider?.rejectionReason}
            />
          )}

          {/* Quick actions */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold">Quick actions</h2>
            <div className="grid gap-2">
              {(quickActions[role] || quickActions.user).map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-3 text-sm font-medium transition hover:border-[#caeb66] hover:bg-[#caeb66]/20"
                >
                  <Icon className="size-4 text-[#03373d]" />
                  {label}
                </Link>
              ))}
              {role === "user" && riderStatus === "none" && (
                <Link
                  to="/rider"
                  className="flex items-center gap-3 rounded-xl border border-dashed border-[#33929d] px-4 py-3 text-sm font-medium text-[#33929d] transition hover:bg-[#33929d]/10"
                >
                  <MdOutlinePedalBike className="size-4" />
                  Become a rider and earn
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Edit profile */}
          <div id="edit-profile" className="scroll-mt-24 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Edit profile</h2>
            <p className="text-sm text-gray-500">
              Your name and photo are shown on parcels and to riders.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Full name</label>
                <input
                  {...register("name", { required: true })}
                  className="input w-full bg-white"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Phone</label>
                  <input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    {...register("phone", { pattern: /^\+?[0-9][0-9\s-]{5,19}$/ })}
                    className="input w-full bg-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Gender</label>
                  <select {...register("gender")} className="select w-full bg-white">
                    <option value="">Prefer not to say</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Profile photo</label>
                <label className="flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed border-gray-200 p-4 transition hover:border-[#caeb66]">
                  {avatar ? (
                    <img src={avatar} alt="" className="h-14 w-14 rounded-full object-cover" />
                  ) : (
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                      <FiCamera className="size-5 text-gray-400" />
                    </span>
                  )}
                  <div className="text-sm">
                    <p className="font-medium">
                      {preview ? "New photo selected" : "Click to upload a new photo"}
                    </p>
                    <p className="text-xs text-gray-500">JPG or PNG, square images look best</p>
                  </div>
                  <input type="file" accept="image/*" {...register("photo")} className="hidden" />
                </label>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input value={user?.email || ""} readOnly className="input w-full bg-gray-100" />
                <p className="mt-1 text-xs text-gray-400">Email can't be changed.</p>
              </div>

              <button
                disabled={saving}
                className="btn w-full border-[#caeb66] bg-[#caeb66] text-black sm:w-auto"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </form>
          </div>

          {/* Rider details */}
          {role === "rider" && rider && (
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold">Rider details</h2>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Phone", rider.phone],
                  ["Age", rider.age || "—"],
                  ["NID", rider.nid],
                  ["Driving license", rider.drivingLicense],
                  ["Bike", rider.bikeModel],
                  ["Registration", rider.bikeRegistration],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-gray-50 p-3">
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

          {/* Security */}
          <div id="security" className="scroll-mt-24 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <FiLock /> Security
            </h2>
            {isPasswordAccount ? (
              <>
                <p className="mt-1 text-sm text-gray-500">
                  We'll email you a secure link to set a new password.
                </p>
                <button onClick={handlePasswordReset} className="btn btn-sm mt-4">
                  Send password reset email
                </button>
              </>
            ) : (
              <p className="mt-1 text-sm text-gray-500">
                You sign in with Google, so your password is managed by your Google account.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
