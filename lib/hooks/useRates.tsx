import { useQuery } from "@tanstack/react-query";

import { fetchDailyRate } from "../currencyApi";
import { useCurrencies } from "../currenciesStore";

export function useRates() {
    const currencies = useCurrencies(s => s.list);
    return useQuery({
        // supportedCodes omitted from the key: static for the app's lifetime
        queryKey: ["daily-rate", "EUR", "2d"],
        queryFn: () => fetchDailyRate(currencies.map(c => c.iso_code)),
        staleTime: 60 * 60 * 1000,
    })
}
