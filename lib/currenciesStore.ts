import { create } from "zustand";
import { CurrencyEntry } from "./currencyApi";
import { INITIAL_PAIR } from "./constants";
import { persist } from "zustand/middleware";
import { favoriteEntryId } from "./helpers";

export type Pair = {
  base: string;
  quote: string;
};

type CurrenciesStoreState = {
  list: CurrencyEntry[];
  map: Record<string, CurrencyEntry>;
  pair: Pair;
  amount: string;
  favorites: { id: string; pair: { base: string; quote: string } }[];
  logs: {
    id: string;
    pair: Pair;
    timestamp: number;
    sendAmount: string;
    receiveAmount: string;
  }[];
};

type CurrenciesStoreActions = {
  setAmount: (newAmount: string) => void;
  setPair: (send: string, receive: string) => void;
  toggleFavorite: (pair: Pair) => void;
  logConversion: (
    pair: Pair,
    timestamp: number,
    sendAmount: string,
    receiveAmount: string,
  ) => void;
  clearLogs: () => void;
  deleteLog: (id: string) => void;
  hydrateCurrencies: (array: CurrencyEntry[]) => void;
};

type CurrenciesStore = CurrenciesStoreState & CurrenciesStoreActions;

export const useCurrencies = create<CurrenciesStore>()(
  persist(
    (set, get) => ({
      list: [],
      map: {},
      amount: "1",
      pair: {
        base: INITIAL_PAIR.base,
        quote: INITIAL_PAIR.quote,
      },
      logs: [],

      favorites: [],

      setAmount: (newAmount) => {
        set({ amount: newAmount });
      },

      hydrateCurrencies: (array) => {
        const object = Object.fromEntries(
          array.map((entry) => [entry.iso_code, entry]),
        );
        set({ list: array, map: object });
      },

      toggleFavorite: (pair) => {
        const id = favoriteEntryId(pair.base, pair.quote);
        const favorites = get().favorites;
        const entry = favorites.find((e) => e.id === id);

        const newFavorites = entry
          ? favorites.filter((e) => e.id !== id)
          : [{ id: id, pair: pair }, ...favorites];

        set({
          favorites: newFavorites,
        });
      },

      logConversion(pair, timestamp, sendAmount, receiveAmount) {
        if (sendAmount === "" || receiveAmount === "") return;

        const logs = get().logs;
        const id = crypto.randomUUID();

        const newEntry = {
          id: id,
          pair: pair,
          timestamp: timestamp,
          sendAmount: sendAmount,
          receiveAmount: receiveAmount,
        };

        const newLogs = [newEntry, ...logs].slice(0, 99);

        set({
          logs: newLogs,
        });
      },

      deleteLog(id) {
        const logs = get().logs;
        const filteredLogs = logs.filter((entry) => entry.id !== id);

        set({
          logs: filteredLogs,
        });
      },

      clearLogs() {
        set({
          logs: [],
        });
      },

      setPair: (base, quote) => {
        set({
          pair: {
            base: base,
            quote: quote,
          },
        });
      },
    }),
    {
      name: "state",
      partialize: (state) => ({
        pair: state.pair,
        favorites: state.favorites,
        logs: state.logs,
      }),
      skipHydration: true,
    },
  ),
);
