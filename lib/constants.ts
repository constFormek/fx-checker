export const VALID_AMOUNT_REGEX = /^\d*\.?\d*$/;

export const INITIAL_PAIR = { base: "USD", quote: "EUR" };

export const POPULAR_CODES = ["USD", "GBP", "EUR", "PLN"];

export const TICKER_PAIRS = [
  {
    base: "USD",
    quote: "JPY",
  },

  {
    base: "EUR",
    quote: "USD",
  },

  {
    base: "USD",
    quote: "CHF",
  },

  {
    base: "EUR",
    quote: "GBP",
  },

  {
    base: "AUD",
    quote: "USD",
  },

  {
    base: "USD",
    quote: "CAD",
  },

  {
    base: "PLN",
    quote: "EUR",
  },

  {
    base: "CHF",
    quote: "PLN",
  },

  {
    base: "PLN",
    quote: "GBP",
  },

   {
    base: "AUD",
    quote: "GBP",
  },

   {
    base: "CHF",
    quote: "KRW",
  },

   {
    base: "KRW",
    quote: "EUR",
  },

   {
    base: "USD",
    quote: "KRW",
  },

   {
    base: "EUR",
    quote: "INR",
  },

   {
    base: "USD",
    quote: "INR",
  },

];

export const COMPARE_CODES = [
  "GBP",
  "JPY",
  "CHF",
  "CAD",
  "AUD",
  "INR",
  "CNY",
  "BDT",
];

export const CHARTS_PERIODS = ["1d", "1w", "1m", "3m", "1y", "5y"] as const;
export const CHART_STAT_LABELS = [
  "Open",
  "Last",
  "Change",
  "% Change",
] as const;
export const LABEL_GAP = 16;
export const FONT_SIZE = 10;
export const STROKE_WIDTH = 2;
export const TEXT_WIDTH = 60;

export const FAVORITES_LIMIT = 99;
