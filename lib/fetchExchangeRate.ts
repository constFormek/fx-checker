interface fetchExchangeRateProps {
  base: string; // type of the possible currencies
  symbol: string;
  amount: number;
}

export type response = {
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
  amount,
}: fetchExchangeRateProps): Promise<response> => {
  try {
    const data = await fetch(
      `https://api.frankfurter.dev/v1/latest?amount=${amount}&base=${base}&symbols=${symbol}`,
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
