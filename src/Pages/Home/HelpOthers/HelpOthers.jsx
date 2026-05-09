import brand1 from "../../../assets/brands/amazon_vector.png";
import brand2 from "../../../assets/brands/amazon.png";
import brand3 from "../../../assets/brands/casio.png";
import brand4 from "../../../assets/brands/moonstar.png";
import brand5 from "../../../assets/brands/randstad.png";
import brand6 from "../../../assets/brands/start_people.png";

const HelpOthers = () => {
    return (
      <div className="flax flax-cols items-center container mx-auto px-4 py-12 justify-center">
        <h1 className="text-3xl font-bold text-center mb-8">
          We've helped thousands of sales teams
        </h1>
        <div className="flex gap-10 flex-wrap justify-between mb-20">
          <img src={brand1} alt="Brand 1" />
          <img src={brand2} alt="Brand 2" />
          <img src={brand3} alt="Brand 3" />
          <img src={brand4} alt="Brand 4" />
          <img src={brand5} alt="Brand 5" />
          <img src={brand6} alt="Brand 6" />
        </div>
      </div>
    );
};

export default HelpOthers;