import { fetchHelper } from "./fetchHelper";

interface fetchExchangeRateProps {
  base: string; // type of the possible currencies
  symbol: string;
}

export type ExchangeObject = {
  amount: number;
  base: string;
  date: string;
  rates: {
    [key: string]: number;
  };
};
export const fetchExchangeRate = ({ base, symbol }: fetchExchangeRateProps) => {
  const url = `https://api.frankfurter.dev/v1/latest?amount=${1}&base=${base}&symbols=${symbol}`;

  return fetchHelper<ExchangeObject>(url);
};

type CurrencyEntry = {
  iso_code: string;
  iso_numeric: string;
  name: string;
};

export const fetchCurrenciesData = () => {
  const url = `https://api.frankfurter.dev/v2/currencies`;
  return fetchHelper<CurrencyEntry[]>(url);
};
