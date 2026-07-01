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

const d = new Date();
d.setDate(d.getDate() - 1);
const from = d.toISOString().slice(0, 10);

type GroupedRates = Record<string, Record<string, number>>;

export const fetchTickerData = async () => {
  const url = `https://api.frankfurter.dev/v2/rates?from=${from}&base=EUR`;
  const array = await fetchHelper<ExchangeObject[]>(url);

  const result: GroupedRates = {};

  for (let i = 0; i < array.length; i++) {
    const row = array[i];

    if (!result[row.date]) result[row.date] = {};

    result[row.date][row.quote] = row.rate;
  }

  return result;
};
