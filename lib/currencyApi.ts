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
