interface fetchExchangeRateProps {
  base: string; // type of the possible currencies
  symbol: string;
}

export type exchangeObject = {
  amount: number;
  base: string;
  date: string;
  rates: {
    [key: string]: number;
  };
};
export const fetchExchangeRate = async ({
  base,
  symbol,
}: fetchExchangeRateProps): Promise<exchangeObject> => {
  try {
    const data = await fetch(
      `https://api.frankfurter.dev/v1/latest?amount=${1}&base=${base}&symbols=${symbol}`,
    );

    if (!data.ok) {
      throw new Error("idk but something went wrong probably with them");
    }

    const json = await data.json();

    return json;
  } catch (error) {
    throw new Error(`Oops, something went wrong! ${error}`);
  }
};
