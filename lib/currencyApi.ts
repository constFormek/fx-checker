import { PeriodType } from "@/components/tabs/history/History";
import { Pair } from "./currenciesStore";
import { fetchHelper } from "./fetchHelper";
import { ChartData } from "@/components/tabs/history/helpers";

interface fetchExchangeRateProps {
  base: string;
  quote: string;
}

export type ExchangeObject = {
  date: string;
  base: string;
  quote: string;
  rate: number;
};
export const fetchExchangeRate = ({ base, quote }: fetchExchangeRateProps) => {
  const url = `https://api.frankfurter.dev/v2/rate/${base}/${quote}`;

  return fetchHelper<ExchangeObject>(url);
};

export type CurrencyEntry = {
  iso_code: string;
  name: string;
  flag: string;
};

export const fetchCurrenciesData = () => {
  const url = `https://api.frankfurter.dev/v2/currencies`;
  return fetchHelper<CurrencyEntry[]>(url);
};

export type GroupedRates = Record<string, Record<string, number>>;

const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toISODate(d);
};

export const fetchDailyRate = async (
  supportedCurrencies: string[],
): Promise<GroupedRates> => {
  const from = daysAgo(7);

  const url = `https://api.frankfurter.dev/v2/rates?from=${from}&base=EUR`;
  const rows = await fetchHelper<ExchangeObject[]>(url);

  const result: GroupedRates = {};

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    if (!result[row.date]) result[row.date] = {};

    result[row.date][row.quote] = row.rate;
  }

  const datesArray = Object.keys(result).sort();
  const completeDates = datesArray
    .filter((date) =>
      supportedCurrencies.every((entry) => result[date][entry] !== undefined),
    )
    .slice(-2);

  if (completeDates.length < 2)
    throw new Error(
      `Expected 2 complete rate days in last 7, got ${completeDates.length}`,
    );

  return Object.fromEntries(
    completeDates.map((date) => {
      return [date, result[date]];
    }),
  );
};

const PERIODS: Record<PeriodType, number> = {
  "1d": 1,
  "1w": 7,
  "1m": 30,
  "3m": 90,
  "1y": 365,
  "5y": 1825,
};

export const fetchHistoryRate = async (period: PeriodType, pair: Pair) => {
  const days = PERIODS[period];
  const group = days >= 365 ? "month" : days >= 90 ? "week" : null;
  const groupPart = group !== null ? `&group=${group}` : "";

  const from = daysAgo(days + 7);

  const url = `https://api.frankfurter.dev/v2/rates?base=${pair.base}&from=${from}&quotes=${pair.quote}${groupPart}`;

  const all = await fetchHelper<ExchangeObject[]>(url);
  const start = daysAgo(days);
  const rows = all.filter((r) => r.date >= start);

  const chartData: ChartData = rows.map((entry) => {
    return {
      date: entry.date,
      rate: entry.rate,
    };
  });

  return chartData;
};
