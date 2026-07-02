import { TabType } from "@/components/tabs/config";

export const optionId = (prefix: string, code: string) =>
  `${prefix}-option-${code}`;

export const tabId = (prefix: string, tab: TabType) => {
  return `${prefix}-${tab}-tab`;
};

export const favoriteEntryId = (base: string, quote: string) => {
  return `${base.toLowerCase()}-${quote.toLowerCase()}-pair`;
};
