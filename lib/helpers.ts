import { TabType } from "@/components/tabs/config";
import { GroupedRates } from "./currencyApi";

export const optionId = (prefix: string, code: string) =>
  `${prefix}-option-${code}`;

export const tabId = (prefix: string, tab: TabType) => {
  return `${prefix}-${tab}-tab`;
};

export const favoriteEntryId = (base: string, quote: string) => {
  return `${base.toLowerCase()}-${quote.toLowerCase()}-pair`;
};

export const getPairSnapshot = (
  data: GroupedRates,
  from: string,
  to: string,
) => {
  const dates = Object.keys(data);
  const todaysRate = crossRate(data[dates[1]], from, to);
  const yesterdaysRate = crossRate(data[dates[0]], from, to);

  const changeObject = calculateChange(yesterdaysRate, todaysRate);

  return {
    todaysRate: todaysRate,
    yesterdaysRate: yesterdaysRate,
    change: changeObject.change,
    changePercentage: changeObject.percentage,
  };
};
export const crossRate = (
  dayRates: Record<string, number>,
  from: string,
  to: string,
) => {
  return dayRates[to] / dayRates[from];
};

export const calculateChange = (old: number, newer: number) => {
  const change = newer - old;
  const percentage = ((newer - old) / old) * 100;

  return {
    change: change,
    percentage: percentage,
  };
};

export const formatAmount = (number: number) => {
  return number.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

export const formatTime = (timestamp: number) => {
  const msElapsed = Date.now() - timestamp;

  const SECOND = 1000;
  const MINUTE = SECOND * 60;
  const HOUR = MINUTE * 60;
  const DAY = HOUR * 24;
  const WEEK = DAY * 7;

  if (msElapsed < MINUTE) return "now";
  else if (msElapsed < HOUR) {
    return `${Math.floor(msElapsed / MINUTE)}M`;
  } else if (msElapsed < DAY) {
    return `${Math.floor(msElapsed / HOUR)}H`;
  } else if (msElapsed < WEEK) {
    return `${Math.floor(msElapsed / DAY)}D`;
  } else {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  }
};

export const formatChartDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-us", {
    month: "short",
    day: "numeric",
  });
};

export const calculateX = (
  index: number,
  pointsCount: number,
  width: number,
) => {
  const t = index / pointsCount;
  const x = t * width;
  return x;
};
export const calculateY = (
  rate: number,
  minRate: number,
  maxRate: number,
  height: number,
) => {
  const t = (rate - minRate) / (maxRate - minRate);
  const y = height - t * height;
  return y;
};
