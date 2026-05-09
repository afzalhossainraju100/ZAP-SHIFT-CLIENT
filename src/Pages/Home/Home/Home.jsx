import Banner from "../Banner/Banner";
import WorkingProcess from "../WorkingProcess/WorkingProcess";
import OurService from "../OurService/OurService";
import HelpOthers from "../HelpOthers/HelpOthers";
import Commitment from "../Commitment/Commitment";
import Marchant from "../Merchant/Merchant";
import FAQ from "../FAQ/FAQ";

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <WorkingProcess></WorkingProcess>
            <OurService></OurService>
            <HelpOthers></HelpOthers>
            <Commitment></Commitment>
            <Marchant></Marchant>

            <FAQ></FAQ>
        </div>
    );
};

export default Home;