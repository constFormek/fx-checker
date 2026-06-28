"use client";

import Image from "next/image";
import { useState } from "react";
import Icon from "./Icon";
import { useCurrencies } from "@/lib/currenciesStore";
import SelectorRow from "./SelectorRow";
import { inputVariant } from "./CurrencyInput";
import { POPULAR_CODES } from "@/lib/constants";
import CategoryGroup from "./CategoryGroup";

interface CurrencySelectorProps {
  currentCode: string;
  variant: inputVariant;
  changeCurrency: (input: inputVariant, code: string) => void;
}

const CurrencySelector = ({
  currentCode,
  variant,
  changeCurrency,
}: CurrencySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState<string>("");
  const map = useCurrencies((s) => s.map);
  const list = useCurrencies((s) => s.list);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    setQuery(e.target.value);
  };

  const normalizedQuery = query.toLowerCase();

  const searchResults = list.filter((entry) => {
    const codeQuery = entry.iso_code.toLowerCase().includes(normalizedQuery);
    const nameQuery = entry.name.toLowerCase().includes(normalizedQuery);

    return codeQuery || nameQuery;
  });

  const popularEntries = list.filter((c) => POPULAR_CODES.includes(c.iso_code));
  const otherEntries = list.filter((c) => !POPULAR_CODES.includes(c.iso_code));

  const categoriesMap = [
    {
      label: "Popular",
      entries: popularEntries,
    },
    {
      label: "Other currencies",
      entries: otherEntries,
    },
  ];
  const findCurrentCurrency = (code: string) => {
    const entry = map[code];

    return entry ? entry : { iso_code: code, flag: "/", name: "LOADING" };
  };
  const selectedCurrency = findCurrentCurrency(currentCode);

  return (
    <div className="md:relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-8 flex items-center gap-2 border-2 border-neutral-400 bg-neutral-500 p-2.5"
      >
        <Image
          className="rounded-full"
          src={selectedCurrency.flag}
          width={20}
          height={20}
          alt={`${selectedCurrency.name}`}
        />

        <p className="text-preset-4">{currentCode}</p>

        <Icon name="chevron-down" className="" size={24} />
      </button>

      <div
        className={`${isOpen ? "absolute" : "hidden"} rounded-8 top-full -right-0.5 -left-0.5 z-100 mt-2 flex max-h-122 flex-col gap-2.5 overflow-y-auto border-2 border-neutral-400 bg-neutral-600 p-2 md:right-full md:left-0 md:w-94`}
      >
        <div className="rounded-6 flex items-center gap-2.5 border-2 border-neutral-200 p-3">
          <Icon name="search" size={24} />

          <input
            type="text"
            placeholder="Search currencies..."
            className="text-preset-5 outline-none"
            onChange={handleChange}
            value={query}
          />
        </div>

        <div className="flex flex-col gap-4">
          {query ? (
            searchResults.length > 0 ? (
              searchResults.map((entry) => (
                <SelectorRow
                  key={entry.iso_code}
                  currentCode={currentCode}
                  variant={variant}
                  changeCurrency={changeCurrency}
                  setIsOpen={setIsOpen}
                  entry={entry}
                />
              ))
            ) : (
              <p className="rounded-4 text-preset-4 border border-transparent px-2 py-3">
                No currencies found
              </p>
            )
          ) : (
            categoriesMap.map((category) => (
              <CategoryGroup
                key={category.label}
                label={category.label}
                entries={category.entries}
                currentCode={currentCode}
                variant={variant}
                setIsOpen={setIsOpen}
                changeCurrency={changeCurrency}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrencySelector;
