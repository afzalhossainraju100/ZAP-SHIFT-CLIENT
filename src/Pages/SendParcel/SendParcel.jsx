import { useEffect, useState, useCallback, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";

const SendParcel = () => {
  const [regions, setRegions] = useState([]);
  const [regionDistrictMap, setRegionDistrictMap] = useState({});
  const { register, handleSubmit, control } = useForm();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Use useWatch hook (compiler-friendly alternative to watch())
  const senderRegion = useWatch({
    control,
    name: "senderRegion",
    defaultValue: "",
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
    (data) => {
      console.log(data);

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
        confirmButtonText: "I Agree!",
      }).then((result) => {
        if (result.isConfirmed) {
          //save the parcel to the database
          axiosSecure
            .post("/parcels", { ...data, cost })
            .then((response) => {
              console.log("Parcel booking response:", response.data);
              if (response.data.insertedId) {
                Swal.fire(
                  "Success!",
                  "Your Parcel has been booked successfully.",
                  "success",
                );
              } else {
                Swal.fire(
                  "Error!",
                  "There was an issue booking your parcel. Please try again.",
                  "error",
                );
              }
            })
            .catch((error) => {
              console.error("Error booking parcel:", error);
              Swal.fire(
                "Error!",
                "There was an issue booking your parcel. Please try again.",
                "error",
              );
            });
        }
      });

      //sweetalart

      // const bookingPayload = { ...data, cost };
      // console.log("Calculated Booking Payload:", bookingPayload);
    },
    [axiosSecure],
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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
                    className="w-4 h-4 text-gray-400 accent-gray-400"
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
                  {...register("parcelName")}
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
                  {...register("parcelWeight")}
                  placeholder="Parcel Weight (KG)"
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
                    {...register("senderName")}
                    placeholder="Sender Name"
                    defaultValue={user?.displayName}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caeb66] focus:border-transparent"
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    {...register("senderAddress")}
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
                    {...register("senderPhone")}
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
                    defaultValue={user?.email}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caeb66] focus:border-transparent"
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Region
                  </label>
                  <select
                    {...register("senderRegion")}
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
                    {...register("senderDistrict")}
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
                    {...register("receiverName")}
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
                    {...register("receiverAddress")}
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
                    {...register("receiverContact")}
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
                    {...register("receiverRegion")}
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
                    {...register("receiverDistrict")}
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

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-[#caeb66] hover:bg-[#b8d955] text-[#03373d] font-bold rounded-lg transition-colors duration-300 ease-in-out"
              >
                Proceed to Confirm Booking
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SendParcel;
