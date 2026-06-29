"use client";

import { useCurrencies } from "@/lib/currenciesStore";
import { CurrencyEntry } from "@/lib/currencyApi";
import { useEffect } from "react";

interface CurrencyHydratorProps {
  availableCurrencies: CurrencyEntry[];
}

const CurrencyHydrator = ({ availableCurrencies }: CurrencyHydratorProps) => {
  const hydrateCurrencies = useCurrencies((s) => s.hydrateCurrencies);

  useEffect(() => {
    useCurrencies.persist.rehydrate();
  }, [])

  useEffect(() => {
    hydrateCurrencies(availableCurrencies);
  }, [hydrateCurrencies, availableCurrencies]); // for linting errors

  return null;
};

export default CurrencyHydrator;
