"use client";

import { useCurrencies } from "@/lib/currenciesStore";
import { CurrencyEntry } from "@/lib/currencyApi";
import { useEffect } from "react";



const CurrencyHydrator = ({ currencies }: { currencies: CurrencyEntry[] }) => {
  const setCurrencies = useCurrencies((s) => s.setCurrencies);
  
  useEffect(() => {
    setCurrencies(currencies);
  }, [setCurrencies, currencies]) // for linting errors
  return null;
};

export default CurrencyHydrator;
