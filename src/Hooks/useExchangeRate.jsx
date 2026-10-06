import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

// The server owns the BDT -> USD rate so the page shows exactly what Stripe charges
const useExchangeRate = () => {
  const axiosSecure = useAxiosSecure();

  const { data } = useQuery({
    queryKey: ["exchange-rate"],
    staleTime: Infinity,
    queryFn: async () => (await axiosSecure.get("/exchange-rate")).data,
  });

  const bdtPerUsd = data?.bdtPerUsd || 120;
  const minUsd = data?.minUsd ?? 0.5;

  // Same rounding as the server: whole cents, never below Stripe's minimum
  const toUsd = (amountBdt) =>
    Math.max(minUsd, Math.round((Number(amountBdt) / bdtPerUsd) * 100) / 100);

  return { bdtPerUsd, toUsd };
};

export default useExchangeRate;
