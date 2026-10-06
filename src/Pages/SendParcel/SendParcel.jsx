import { useEffect, useState, useCallback, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import { useNavigate } from "react-router-dom";

const SendParcel = () => {
  const [regions, setRegions] = useState([]);
  const [regionDistrictMap, setRegionDistrictMap] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  useEffect(() => {
    setValue("senderName", user?.displayName || "");
    setValue("senderEmail", user?.email || "");
  }, [setValue, user?.displayName, user?.email]);

  // Use useWatch hook (compiler-friendly alternative to watch())
  const senderRegion = useWatch({
    control,
    name: "senderRegion",
    defaultValue: "",
  });
  const parcelType = useWatch({
    control,
    name: "parcelType",
    defaultValue: "document",
  });
  const receiverRegion = useWatch({
    control,
    name: "receiverRegion",
    defaultValue: "",
  });

  // Get filtered districts based on selected region
  const senderDistricts = useMemo(
    () => (senderRegion ? regionDistrictMap[senderRegion] || [] : []),
    [senderRegion, regionDistrictMap],
  );

  const receiverDistricts = useMemo(
    () => (receiverRegion ? regionDistrictMap[receiverRegion] || [] : []),
    [receiverRegion, regionDistrictMap],
  );

  const handleSendParcel = useCallback(
    async (data) => {
      console.log("Form Data:", data);

      // Validate user is authenticated
      if (!user) {
        Swal.fire("Error!", "Please log in to book a parcel.", "error");
        return;
      }

      const isSameDistrict = data.senderDistrict === data.receiverDistrict;
      const isDocument = data.parcelType === "document";
      const parcelWeight = parseFloat(data.parcelWeight);

      let cost;

      if (isDocument) {
        cost = isSameDistrict ? 60 : 80;
      } else {
        if (parcelWeight <= 3) {
          cost = isSameDistrict ? 110 : 150;
        } else {
          const minCharge = isSameDistrict ? 110 : 150;
          const extraWeight = parcelWeight - 3;
          const extraCharge = isSameDistrict
            ? extraWeight * 40
            : extraWeight * 40 + 40;
          cost = minCharge + extraCharge;
        }
      }

      //sweetAlart
      Swal.fire({
        title: "Agree With The Payment?",
        text: `You have to Pay ${cost} BDT!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Agreed!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          setIsSubmitting(true);
          try {
            // The Firebase token is attached automatically by useAxiosSecure
            const response = await axiosSecure.post("/parcels", data);

            console.log("Parcel booking response:", response);
            console.log("Response status:", response.status);
            console.log("Response data:", response.data);

            const isBooked =
              response.status === 200 ||
              response.status === 201 ||
              response.data?.insertedId ||
              response.data?.acknowledged ||
              response.data?.success;

            if (isBooked) {
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Parcel Booked Successfully!",
                text: "You will be redirected to payment.",
                showConfirmButton: false,
                timer: 2500,
              });
              setTimeout(() => navigate("/dashboard/my-parcels"), 1500);
            } else {
              console.warn(
                "Booking response doesn't indicate success:",
                response.data,
              );
              Swal.fire(
                "Warning!",
                "Parcel may have been booked but confirmation unclear. Please check My Parcels.",
                "warning",
              );
            }
          } catch (error) {
            console.error("Error booking parcel:", error);
            console.error("Error response:", error.response?.data);
            console.error("Error status:", error.response?.status);
            console.error("Error message:", error.message);

            let errorMessage =
              "There was an issue booking your parcel. Please try again.";

            if (error.response?.data?.message) {
              errorMessage = error.response.data.message;
            } else if (error.response?.data?.error) {
              errorMessage = error.response.data.error;
            } else if (error.message) {
              errorMessage = error.message;
            }

            Swal.fire("Error!", errorMessage, "error");
          } finally {
            setIsSubmitting(false);
          }
        }
      });
    },
    [axiosSecure, user, navigate],
  );

  useEffect(() => {
    const loadServiceCenterData = async () => {
      try {
        const response = await fetch("/serviceCenter.json");
        const data = await response.json();

        // Extract unique regions
        const uniqueRegions = [
          ...new Set(data.map((item) => item.region)),
        ].sort();
        setRegions(uniqueRegions);

        // Create a map of region to districts
        const map = {};
        uniqueRegions.forEach((region) => {
          map[region] = [
            ...new Set(
              data
                .filter((item) => item.region === region)
                .map((item) => item.district),
            ),
          ].sort();
        });
        setRegionDistrictMap(map);
      } catch (error) {
        console.error("Error loading service center data:", error);
      }
    };

    loadServiceCenterData();
  }, []);

  return (
    <div className="min-h-screen text-[#000000] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Card Container */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#03373d] mb-3">
              Send A Parcel
            </h1>
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded">
              <p className="font-semibold">Enter your parcel details</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(handleSendParcel)}>
            {/* Radio Button Section - Parcel Type */}
            <div className="mb-8 pb-8 border-b">
              <div className="flex gap-8">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    {...register("parcelType")}
                    value="document"
                    defaultChecked
                    className="w-4 h-4 text-green-500 accent-green-500"
                  />
                  <span className="text-gray-700 font-medium">Document</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    {...register("parcelType")}
                    value="not-document"
                    className="w-4 h-4 text-green-500 accent-green-500"
                  />
                  <span className="text-gray-700 font-medium">
                    Not-Document
                  </span>
                </label>
              </div>
            </div>

            {/* Parcel Details - Two Column */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Parcel Name
                </label>
                <input
                  type="text"
                  {...register("parcelName", { required: true })}
                  placeholder="Parcel Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caeb66] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Parcel Weight (KG)
                </label>
                <input
                  type="number"
                  {...register("parcelWeight", {
                    validate: (value, values) =>
                      values.parcelType === "document" || Number(value) > 0,
                  })}
                  disabled={parcelType === "document"}
                  step="0.1"
                  min="0"
                  placeholder={
                    parcelType === "document"
                      ? "Not needed for documents"
                      : "Parcel Weight (KG)"
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caeb66] focus:border-transparent"
                />
              </div>
            </div>

            {/* Sender and Receiver Details - Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b">
              {/* Sender Details */}
              <div>
                <h3 className="text-lg font-bold text-[#03373d] mb-6">
                  Sender Details
                </h3>

                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sender Name
                  </label>
                  <input
                    type="text"
                    {...register("senderName", { required: true })}
                    placeholder="Sender Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caeb66] focus:border-transparent"
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    {...register("senderAddress", { required: true })}
                    placeholder="Address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caeb66] focus:border-transparent"
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sender Phone No
                  </label>
                  <input
                    type="tel"
                    {...register("senderPhone", { required: true })}
                    placeholder="Sender Phone No"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caeb66] focus:border-transparent"
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sender Email
                  </label>
                  <input
                    type="email"
                    {...register("senderEmail")}
                    placeholder="Sender Email"
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caeb66] focus:border-transparent"
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Region
                  </label>
                  <select
                    {...register("senderRegion", { required: true })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caeb66] focus:border-transparent bg-white"
                  >
                    <option value="">Select your Region</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your District
                  </label>
                  <select
                    {...register("senderDistrict", { required: true })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caeb66] focus:border-transparent bg-white"
                    disabled={!senderRegion}
                  >
                    <option value="">Select your District</option>
                    {senderDistricts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pickup Instruction
                  </label>
                  <textarea
                    {...register("pickupInstruction")}
                    placeholder="Pickup Instruction"
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caeb66] focus:border-transparent resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Receiver Details */}
              <div>
                <h3 className="text-lg font-bold text-[#03373d] mb-6">
                  Receiver Details
                </h3>

                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Receiver Name
                  </label>
                  <input
                    type="text"
                    {...register("receiverName", { required: true })}
                    placeholder="Receiver Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caeb66] focus:border-transparent"
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Receiver Address
                  </label>
                  <input
                    type="text"
                    {...register("receiverAddress", { required: true })}
                    placeholder="Address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caeb66] focus:border-transparent"
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Receiver Contact No
                  </label>
                  <input
                    type="tel"
                    {...register("receiverContact", { required: true })}
                    placeholder="Receiver Contact No"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caeb66] focus:border-transparent"
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Receiver Email
                  </label>
                  <input
                    type="email"
                    {...register("receiverEmail")}
                    placeholder="Receiver Email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caeb66] focus:border-transparent"
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Receiver Region
                  </label>
                  <select
                    {...register("receiverRegion", { required: true })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caeb66] focus:border-transparent bg-white"
                  >
                    <option value="">Select Receiver Region</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Receiver District
                  </label>
                  <select
                    {...register("receiverDistrict", { required: true })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caeb66] focus:border-transparent bg-white"
                    disabled={!receiverRegion}
                  >
                    <option value="">Select District</option>
                    {receiverDistricts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Delivery Instruction
                  </label>
                  <textarea
                    {...register("deliveryInstruction")}
                    placeholder="Delivery Instruction"
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caeb66] focus:border-transparent resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Pickup Time Note */}
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                * PickUp Time 4pm-7pm Approx.
              </p>
            </div>

            {Object.keys(errors).length > 0 && (
              <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                Please fill in all fields
                {errors.parcelWeight ? " (weight is required for non-document parcels)" : ""}.
                Only the instructions and receiver email are optional.
              </p>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={authLoading || isSubmitting}
                className="w-full md:w-auto px-8 py-3 bg-[#caeb66] hover:bg-[#b8d955] disabled:bg-gray-400 disabled:cursor-not-allowed text-[#03373d] font-bold rounded-lg transition-colors duration-300 ease-in-out"
              >
                {isSubmitting ? "Processing..." : "Proceed to Confirm Booking"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SendParcel;
