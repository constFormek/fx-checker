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
  dates: string[],
  from: string,
  to: string,
) => {
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
