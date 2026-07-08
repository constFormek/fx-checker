import { PeriodType } from "@/components/tabs/History";
import { Pair } from "./currenciesStore";
import { fetchHelper } from "./fetchHelper";

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

export const fetchDailyRate = async (
  supportedCurrencies: string[],
): Promise<GroupedRates> => {
  const d = new Date();
  d.setDate(d.getDate() - 7); // 7-day window: survives weekend + holiday + one incomplete day
  const from = d.toISOString().slice(0, 10);

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

export const fetchHistoryRate = async (period: PeriodType, pair: Pair) => {
  let days = 0;

  switch (period) {
    case "1d":
      days = 1;
      break;
    case "1w":
      days = 7;
      break;
    case "1m":
      days = 30;
      break;
    case "3m":
      days = 90;
      break;
    case "1y":
      days = 12 * 30;
      break;
    case "5y":
      days = 12 * 30 * 5;
      break;
  }

  const d = new Date();
  d.setDate(d.getDate() - days);
  const fromUrl = d.toISOString().slice(0, 10);

  const url = `https://api.frankfurter.dev/v2/rates?base=${pair.base}&from=${fromUrl}&quotes=${pair.quote}`;

  const data = await fetchHelper<ExchangeObject[]>(url);

  const chartData = data.map((entry) => {
    return {
      date: entry.date,
      rate: entry.rate,
    };
  });

  return chartData;
};
