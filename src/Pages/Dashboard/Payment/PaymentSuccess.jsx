import { useSearchParams } from "react-router";
import { useEffect } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";


const PaymentSuccess = () => {

    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    console.log(sessionId);
    const axiosSecure = useAxiosSecure();

    useEffect (() => {
        if (sessionId) {
            axiosSecure
              .patch(`/payment-success?session_id=${sessionId}`)
              .then((res) => {
                console.log(res.data);
              });
        }
    }, [sessionId,axiosSecure]);

    return (
        <div className="mt-20 mx-4 bg-[#ffffff] text-[#000000] h-screen flex items-center justify-center gap-5">
            <h1>Payment Successful</h1>
        </div>
    );
};

export default PaymentSuccess;