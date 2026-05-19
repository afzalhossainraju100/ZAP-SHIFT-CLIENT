import { useSearchParams } from "react-router";
import { useEffect } from "react";


const PaymentSuccess = () => {

    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    console.log(sessionId);

    useEffect (() => {
        if (sessionId) {
            <h1>Payment Successful</h1>
        }
    }, [sessionId]);

    return (
        <div className="mt-20 mx-4 bg-[#ffffff] text-[#000000] h-screen flex items-center justify-center gap-5">
            <h1>Payment Successful</h1>
        </div>
    );
};

export default PaymentSuccess;