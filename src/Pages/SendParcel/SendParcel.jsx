import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const SendParcel = () => {
  const [districts, setDistricts] = useState([]);
  const { register, handleSubmit } = useForm();

  const handleSendParcel = (data) => {
    console.log(data);
  };

  useEffect(() => {
    fetch("/serviceCenter.json")
      .then((res) => res.json())
      .then((data) => {
        const uniqueDistricts = [
          ...new Set(data.map((item) => item.district)),
        ].sort();
        setDistricts(uniqueDistricts);
      });
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
                    Your District
                  </label>
                  <select
                    {...register("senderDistrict")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caeb66] focus:border-transparent bg-white"
                  >
                    <option value="">Select your District</option>
                    {districts.map((district) => (
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
                    Receiver District
                  </label>
                  <select
                    {...register("receiverDistrict")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caeb66] focus:border-transparent bg-white"
                  >
                    <option value="">Select District</option>
                    {districts.map((district) => (
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
