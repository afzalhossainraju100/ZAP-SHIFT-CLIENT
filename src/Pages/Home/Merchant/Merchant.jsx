import locationmerchant from "../../../assets/locationmerchant.png";
import beamerchantbg from "../../../assets/beamerchantbg.png";

const Marchant = () => {
  return (
    <div className="bg-[#03373D] rounded-2xl mt-15 mb-15">
      <div className="relative flex items-center justify-center">
        <img  src={beamerchantbg} alt="" />
      </div>
      
      <div className="flex px-10 -mt-6 md:-mt-20 relative z-10 items-center justify-evenly flex-col md:flex-row gap-10 ">
        <div className="flex flex-col px-10 space-y-6 mb-15">
          <h1 className="text-3xl font-bold   text-[#ffffff]">
            Merchant and Customer Satisfaction is Our First Priority
          </h1>
          <p className="text-[#ffffff]">
            We offer the lowest delivery charge with the highest value along
            with 100% safety of your product. Pathao courier delivers your
            parcels in every corner of Bangladesh right on time.
          </p>
          <div className="flex gap-6">
            <button className="bg-[#CAEB66] p-2 px-4 rounded-2xl">
              Become a Merchant
            </button>
            <button className="bg-transparent border border-[#CAEB66] text-[#CAEB66] p-2 px-4 rounded-2xl">
              Earn with ZapShift Courier
            </button>
          </div>
        </div>
        <div>
          <img className="mb-15" src={locationmerchant} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Marchant;
