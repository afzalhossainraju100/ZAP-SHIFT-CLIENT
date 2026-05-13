import riderImage from "../../assets/agent-pending.png";

const Rider = () => {
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

              <form className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="h-11 w-full rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-lime-400 focus:ring-2 focus:ring-lime-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Driving License Number
                  </label>
                  <input
                    type="text"
                    placeholder="Driving License Number"
                    className="h-11 w-full rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-lime-400 focus:ring-2 focus:ring-lime-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Your Email
                  </label>
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="h-11 w-full rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-lime-400 focus:ring-2 focus:ring-lime-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Your Region
                  </label>
                  <select className="h-11 w-full rounded-md border border-slate-200 px-3 text-sm text-slate-400 outline-none transition focus:border-lime-400 focus:ring-2 focus:ring-lime-100">
                    <option value="">Select your Region</option>
                    <option>Dhaka</option>
                    <option>Chattogram</option>
                    <option>Rajshahi</option>
                    <option>Khulna</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Your District
                  </label>
                  <select className="h-11 w-full rounded-md border border-slate-200 px-3 text-sm text-slate-400 outline-none transition focus:border-lime-400 focus:ring-2 focus:ring-lime-100">
                    <option value="">Select your District</option>
                    <option>Dhaka</option>
                    <option>Gazipur</option>
                    <option>Narayanganj</option>
                    <option>Cumilla</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    NID No
                  </label>
                  <input
                    type="text"
                    placeholder="NID"
                    className="h-11 w-full rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-lime-400 focus:ring-2 focus:ring-lime-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="Phone Number"
                    className="h-11 w-full rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-lime-400 focus:ring-2 focus:ring-lime-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Bike Brand Model and Year
                  </label>
                  <input
                    type="text"
                    placeholder="Bike Brand Model and Year"
                    className="h-11 w-full rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-lime-400 focus:ring-2 focus:ring-lime-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Bike Registration Number
                  </label>
                  <input
                    type="text"
                    placeholder="Bike Registration Number"
                    className="h-11 w-full rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-lime-400 focus:ring-2 focus:ring-lime-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Tell Us About Yourself
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Tell Us About Yourself"
                    className="w-full rounded-md border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-lime-400 focus:ring-2 focus:ring-lime-100"
                  />
                </div>

                <button
                  type="button"
                  className="h-11 w-full rounded-md bg-lime-300 text-sm font-medium text-slate-900 transition hover:bg-lime-400"
                >
                  Submit
                </button>
              </form>
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
