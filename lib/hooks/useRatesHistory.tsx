import { useQuery } from "@tanstack/react-query";
import { fetchHistoryRate } from "../currencyApi";
import { useCurrencies } from "../currenciesStore";
import { PeriodType } from "@/components/tabs/History";

export function useRatesHistory(period: PeriodType) {
  const pair = useCurrencies((s) => s.pair);
  return useQuery({
    queryKey: ["history", pair.base, pair.quote, period],
    queryFn: () => fetchHistoryRate(period, pair),
    staleTime: 60 * 60 * 1000,
  });
}
