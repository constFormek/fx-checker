import { useQuery } from "@tanstack/react-query";

import { fetchDailyRate } from "../currencyApi";

export function useCurrencies() {
    return useQuery({
        queryKey: ["ticker-data"],
        queryFn: fetchDailyRate,
        staleTime: 60 * 60 * 1000,
    })
}
