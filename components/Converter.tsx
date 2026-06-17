"use client";

import { response } from "@/lib/fetchExchangeRate";
import Image from "next/image";
import { useEffect, useState } from "react";

import swapIcon from "@/public/images/icon-exchange-vertical.svg";
import CurrencyInput, { inputVariant } from "./CurrencyInput";

const Converter = () => {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [sendCurrency, setSendCurrency] = useState("USD");
  const [receiveCurrency, setReceivedCurrency] = useState("PLN");
  const [exchangeRate, setExchangeRate] = useState<number>(0);
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

        const json: response = await data.json();
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
      <div className="bg-neutral-700 flex flex-col divide-y-2 divide-dashed rounded-16 p-4 w-full">
        <div className="flex flex-col items-center gap-4">
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
            <Image src={swapIcon} alt="" width={20} />
          </button>

          <CurrencyInput
            amount={receiveValue}
            currency={receiveCurrency}
            handleNewAmount={handleNewAmount}
            variant="receive"
            activeInput={activeInput}
          />
        </div>
      </div>
    </div>
  );
};

export default Converter;
