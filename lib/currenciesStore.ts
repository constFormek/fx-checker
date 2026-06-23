import { create } from "zustand";
import { CurrencyEntry } from "./currencyApi";

interface CurrenciesState {
  currenciesArray: CurrencyEntry[];
  currenciesObject: Record<string, CurrencyEntry>;
  setCurrencies: (array: CurrencyEntry[]) => void;
}
export const useCurrencies = create<CurrenciesState>()((set) => ({
  currenciesArray: [],
  currenciesObject: {},

  setCurrencies: (array) => {
    const object = Object.fromEntries(
        array.map((entry) => [entry.iso_code, entry])
    )
    set({ currenciesArray: array, currenciesObject: object })
  },
}));
