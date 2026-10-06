import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import riderImage from "../../assets/agent-pending.png";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { getErrorMessage } from "../../utils/parcelStatus";

const inputClass =
  "h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-lime-400 focus:ring-2 focus:ring-lime-100";

const fields = [
  { name: "name", label: "Your Name", placeholder: "Your Name" },
  { name: "age", label: "Your Age", placeholder: "Your Age", type: "number" },
  { name: "drivingLicense", label: "Driving License Number", placeholder: "Driving License Number" },
  { name: "nid", label: "NID No", placeholder: "NID" },
  { name: "phone", label: "Phone Number", placeholder: "Phone Number", type: "tel" },
  { name: "bikeModel", label: "Bike Brand Model and Year", placeholder: "Bike Brand Model and Year" },
  { name: "bikeRegistration", label: "Bike Registration Number", placeholder: "Bike Registration Number" },
];

const Rider = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [serviceCenters, setServiceCenters] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { name: user?.displayName || "" } });

  const region = useWatch({ control, name: "region", defaultValue: "" });

  const { data: application, refetch } = useQuery({
    queryKey: ["rider-me", user?.email],
    queryFn: async () => (await axiosSecure.get("/riders/me")).data.data,
  });

  useEffect(() => {
    fetch("/serviceCenter.json")
      .then((res) => res.json())
      .then(setServiceCenters)
      .catch((error) => console.error("Could not load service centers:", error));
  }, []);

  const regions = useMemo(
    () => [...new Set(serviceCenters.map((center) => center.region))].sort(),
    [serviceCenters],
  );
  const districts = useMemo(
    () =>
      serviceCenters
        .filter((center) => center.region === region)
        .map((center) => center.district)
        .sort(),
    [serviceCenters, region],
  );

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await axiosSecure.post("/riders", data);
      reset();
      refetch();
      Swal.fire(
        "Application submitted!",
        "An admin will review your application soon.",
        "success",
      );
    } catch (error) {
      Swal.fire("Error!", getErrorMessage(error), "error");
    } finally {
      setSubmitting(false);
    }
  };

  const hasOpenApplication = application && application.status !== "rejected";

  return (
    <div className="min-h-screen bg-[#f6f7f8] p-4 md:p-8">
      <div className="mx-auto max-w-7xl rounded-[28px] bg-white px-6 py-8 shadow-[0_12px_40px_rgba(15,23,42,0.08)] md:px-10 md:py-10">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#043B45] md:text-5xl">
              Be a Rider
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              Enjoy fast, reliable parcel delivery with real-time tracking and
              zero hassle. From personal packages to business shipments — we
              deliver on time, every time.
            </p>

            <div className="my-8 h-px w-full bg-slate-200" />

            <div>
              <h2 className="text-2xl font-bold text-[#043B45] md:text-[28px]">
                Tell us about yourself
              </h2>

              {hasOpenApplication ? (
                <div className="mt-6 rounded-xl border border-lime-300 bg-lime-50 p-6">
                  <p className="text-lg font-semibold text-[#043B45]">
                    Your application is{" "}
                    <span className="capitalize">{application.status}</span>
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    {application.status === "approved"
                      ? "You are a ZapShift rider. Open your dashboard to see your tasks."
                      : `Submitted for ${application.district}. We will review it shortly.`}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                  {application?.status === "rejected" && (
                    <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                      Your previous application was rejected. You can apply again.
                    </p>
                  )}

                  {fields.map((field) => (
                    <div key={field.name}>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        {field.label}
                      </label>
                      <input
                        type={field.type || "text"}
                        placeholder={field.placeholder}
                        {...register(field.name, {
                          required: `${field.label} is required`,
                        })}
                        className={inputClass}
                      />
                      {errors[field.name] && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors[field.name].message}
                        </p>
                      )}
                    </div>
                  ))}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Your Email
                    </label>
                    <input
                      value={user?.email || ""}
                      readOnly
                      className={`${inputClass} bg-slate-100`}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Your Region
                    </label>
                    <select
                      {...register("region", { required: "Region is required" })}
                      className={inputClass}
                    >
                      <option value="">Select your Region</option>
                      {regions.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                    {errors.region && (
                      <p className="mt-1 text-xs text-red-500">{errors.region.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Your District (Service Center)
                    </label>
                    <select
                      {...register("district", { required: "District is required" })}
                      disabled={!region}
                      className={inputClass}
                    >
                      <option value="">Select your District</option>
                      {districts.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                    {errors.district && (
                      <p className="mt-1 text-xs text-red-500">{errors.district.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Tell Us About Yourself
                    </label>
                    <textarea
                      rows="3"
                      placeholder="Tell Us About Yourself"
                      {...register("about")}
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 outline-none transition focus:border-lime-400 focus:ring-2 focus:ring-lime-100"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="h-11 w-full rounded-md bg-lime-300 text-sm font-medium text-slate-900 transition hover:bg-lime-400 disabled:opacity-60"
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center lg:sticky lg:top-10">
            <img
              src={riderImage}
              alt="Rider illustration"
              className="w-full max-w-xl select-none object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rider;
