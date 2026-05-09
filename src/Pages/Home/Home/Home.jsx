import Banner from "../Banner/Banner";
import WorkingProcess from "../WorkingProcess/WorkingProcess";
import OurService from "../OurService/OurService";
import HelpOthers from "../HelpOthers/HelpOthers";
import Commitment from "../Commitment/Commitment";
import Marchant from "../Merchant/Merchant";
import FAQ from "../FAQ/FAQ";
import Reviews from "../Reviews/Reviews";


const reviewsPromise = fetch("/reviews.json").then(res => res.json());
const servicePromise = fetch("/services.json").then(res => res.json());

const Home = () => {
    return (
      <div>
        <Banner></Banner>
        <WorkingProcess></WorkingProcess>
        <OurService servicePromise={servicePromise}></OurService>
        <HelpOthers></HelpOthers>
        <Commitment></Commitment>
        <Marchant></Marchant>
        <Reviews reviewsPromise={reviewsPromise}></Reviews>
        <FAQ></FAQ>
      </div>
    );
};

export default Home;