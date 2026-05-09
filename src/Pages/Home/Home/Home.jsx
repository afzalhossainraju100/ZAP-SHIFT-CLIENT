import Banner from "../Banner/Banner";
import WorkingProcess from "../WorkingProcess/WorkingProcess";
import OurService from "../OurService/OurService";
import HelpOthers from "../HelpOthers/HelpOthers";
import Commitment from "../Commitment/Commitment";

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <WorkingProcess></WorkingProcess>
            <OurService></OurService>
            <HelpOthers></HelpOthers>
            <Commitment></Commitment>
        </div>
    );
};

export default Home;