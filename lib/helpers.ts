import { TabType } from "@/components/tabs/config";
import { GroupedRates } from "./currencyApi";
import { stylesMap } from "@/components/ChangeIndicator";

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
  if (old === 0) return {
    change: 0,
    percentage: 0,
  }
  
  const change = newer - old;
  const percentage = ((newer - old) / old) * 100;

  return {
    change: change,
    percentage: percentage,
  };
};

export type DirectionType = "flat" | "down" | "up";

export const getDirection = (change: number): DirectionType => {
  return change > 0 ? "up" : change < 0 ? "down" : "flat";
};

export const formatChange = (
  value: number,
  dp: number,
): {
  direction: DirectionType;
  text: string;
} => {
  const shown = Number(value.toFixed(dp));
  const direction = getDirection(shown);
  return {
    direction: direction,
    text: `${stylesMap[direction].prefix}${Math.abs(shown).toFixed(dp)}`,
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
