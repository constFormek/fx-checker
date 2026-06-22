"use client";

import { exchangeObject } from "@/lib/fetchExchangeRate";
import { useEffect, useState } from "react";

import CurrencyInput, { inputVariant } from "./CurrencyInput";
import Icon from "./Icon";

interface ConverterProps {
  symbol: string;
  initialExchangeRate: number;
  base: string;
}

const Converter = ({ symbol, initialExchangeRate, base }: ConverterProps) => {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [sendCurrency, setSendCurrency] = useState(base);
  const [receiveCurrency, setReceivedCurrency] = useState(symbol);
  const [exchangeRate, setExchangeRate] = useState<number>(initialExchangeRate);
  const [amount, setAmount] = useState<string>("0");
  const [activeInput, setActiveInput] = useState<inputVariant>("receive");

  const handleNewAmount = (variant: "send" | "receive", newAmount: string) => {
    setActiveInput(variant);
    setAmount(newAmount);
  };

  const swapCurrencies = () => {
    setAmount(Number(receiveValue).toFixed(2));

    setActiveInput("send");

    const temp = sendCurrency;
    setSendCurrency(receiveCurrency);
    setReceivedCurrency(temp);
  };

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const data = await fetch(
          `https://api.frankfurter.dev/v1/latest?amount=1&base=${sendCurrency}&symbols=${receiveCurrency}`,
        );

        const json: exchangeObject = await data.json();
        setExchangeRate(json.rates[receiveCurrency]);
      } catch (error) {
        if (error instanceof Error) setError(error.message);
        else setError("something went wrong");
      }
    };

    fetchExchangeRate();
  }, [receiveCurrency, sendCurrency]);

  const sendValue =
    activeInput === "receive" && exchangeRate > 0
      ? (Number(amount) / exchangeRate).toString()
      : amount;
  const receiveValue =
    activeInput === "send"
      ? (Number(amount) * exchangeRate).toString()
      : amount;
  return (
    <div className="flex flex-col gap-4 w-full p-4">
      <div className="bg-neutral-700 flex flex-col divide-y-2 divide-dashed divide-neutral-500 rounded-16 p-4 w-full">
        <div className="flex flex-col items-center gap-4 p-4">
          <CurrencyInput
            amount={sendValue}
            currency={sendCurrency}
            handleNewAmount={handleNewAmount}
            variant="send"
            activeInput={activeInput}
          />

          <button
            onClick={swapCurrencies}
            className="p-3.25  rounded-8 bg-neutral-600 border border-neutral-500 w-fit"
          >
            <Icon
              name="exchange-vertical"
              size={20}
              className="text-neutral-50"
            />
          </button>

          <CurrencyInput
            amount={receiveValue}
            currency={receiveCurrency}
            handleNewAmount={handleNewAmount}
            variant="receive"
            activeInput={activeInput}
          />
        </div>

        <div className="flex flex-col p-4 gap-4">
          <p className="text-preset-6 text-center">
            1 {sendCurrency.toUpperCase()} = {exchangeRate}{" "}
            {receiveCurrency.toUpperCase()}
          </p>

          <div className="flex items-center gap-2">
            <button className="flex items-center rounded-8 bg-neutral-600 border-2 uppercase border-neutral-300 text-neutral-200 gap-2 p-3 w-fit ">
              <Icon name="star" size={16} />
              Favorite
            </button>

            <button className="flex text-nowrap items-center rounded-8 border-2 uppercase border-neutral-300 text-neutral-200 gap-2 p-3 w-fit ">
              Log conversion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Converter;
