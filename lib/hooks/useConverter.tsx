"use client";

import { inputVariant } from "@/components/CurrencyInput";
import { useState, useEffect } from "react";
import { fetchExchangeRate } from "../currencyApi";
import { VALID_AMOUNT_REGEX } from "../constants";
import { useCurrencies } from "../currenciesStore";
import { useShallow } from "zustand/shallow";

export const useConverter = (initialRate: number) => {
  const { amount, setAmount, base, quote, setPair } = useCurrencies(
    useShallow((s) => ({
      amount: s.amount,
      setAmount: s.setAmount,
      base: s.pair.base,
      quote: s.pair.quote,
      setPair: s.setPair,
    })),
  );
  const [activeInput, setActiveInput] = useState<inputVariant>("base");
  const [exchangeRate, setExchangeRate] = useState<number>(initialRate);

  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getRate = async () => {
      try {
        setIsLoading(true);
        const data = await fetchExchangeRate({
          base: base,
          quote: quote,
        });
        setExchangeRate(data.rate);
        setError("");
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Something went wrong");
        }
      } finally {
        setIsLoading(false);
      }
    };

    getRate();
  }, [base, quote]);

  const swapCurrencies = () => {
    setPair(quote, base);
  };

  const format = (number: number) => {
    if (!Number.isFinite(number)) return "";

    if (number === 0) return "";

    return number.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  const isValidAmount = (str: string) => {
    return VALID_AMOUNT_REGEX.test(str);
  };

  const changeAmount = (input: inputVariant, newAmount: string) => {
    if (!isValidAmount(newAmount)) return;

    setAmount(newAmount);
    setActiveInput(input);
  };

  const changeCurrency = (input: inputVariant, code: string) => {
    if (input === "base") setPair(code, quote);
    else setPair(base, code);
  };

  const baseValue =
    activeInput === "quote" ? format(Number(amount) / exchangeRate) : amount;

  const quoteValue =
    activeInput === "base" ? format(Number(amount) * exchangeRate) : amount;

  return {
    amount,
    quote,
    baseValue,
    base,
    exchangeRate,
    quoteValue,
    activeInput,
    error,
    isLoading,
    setExchangeRate,
    changeCurrency,
    swapCurrencies,
    changeAmount,
  };
};
