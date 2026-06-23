"use client";

import Image from "next/image";
import { useState } from "react";
import Icon from "./Icon";
import { useCurrencies } from "@/lib/currenciesStore";

interface CurrencySelectorProps {
  currentCurrency: string;
  onCurrencyChange: (code: string) => void;
}

const CurrencySelector = ({
  currentCurrency,
  onCurrencyChange,
}: CurrencySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const changeCurrency = (code: string) => {
    onCurrencyChange(code);
    setIsOpen(false);
  };

  const currenciesObject = useCurrencies((s) => s.currenciesObject);
  const currenciesArray = useCurrencies((s) => s.currenciesArray);
  console.log(currenciesObject);
  const popularCodes = ["USD", "GBP", "EUR"];

  const otherCodes = currenciesArray
    .filter((c) => !popularCodes.includes(c.iso_code))
    .map((c) => c.iso_code);

  const categoriesMap = [
    {
      label: "Popular",
      codes: popularCodes,
    },
    {
      label: "Other currencies",
      codes: otherCodes,
    },
  ];

  const findCurrentCurrency = (code: string) => {
    const entry = currenciesObject[code];

    return entry ? entry : { iso_code: code, flag: "/", name: "LOADING" };
  };

  const selectedCurrency = findCurrentCurrency(currentCurrency);

  return (
    <div className="">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center rounded-8 gap-2 p-2.5 bg-neutral-500 border-2 border-neutral-400"
      >
        <Image
          className="rounded-full"
          src={selectedCurrency.flag}
          width={20}
          height={20}
          alt=""
        />

        <p className="text-preset-4">{currentCurrency}</p>

        <Icon name="chevron-down" className="" size={24} />
      </button>

      <div
        className={`${isOpen ? "absolute" : "hidden"} top-full mt-2 max-h-122 overflow-y-auto  z-100 -left-0.5 -right-0.5 rounded-8 p-2 gap-2.5 flex flex-col bg-neutral-600 border-2 border-neutral-400`}
      >
        <div className="flex items-center rounded-6 p-3 gap-2.5 border-2 border-neutral-200 ">
          <Icon name="search" size={24} />

          <input
            type="text"
            placeholder="Search currencies..."
            className="outline-none text-preset-5"
          />
        </div>

        <div className="flex flex-col gap-4">
          {categoriesMap.map((category, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="flex w-full justify-between p-2 text-preset-5 text-neutral-200  border-b-2 border-b-neutral-500">
                <p>{category.label.toUpperCase()}</p>

                <p>{category.codes.length}</p>
              </div>

              <div className="flex flex-col">
                {category.codes.map((code, index) => {
                  const thisCurrency = findCurrentCurrency(code);
                  return (
                    <button
                      onClick={() => changeCurrency(code)}
                      className="flex items-center w-full justify-between px-2 py-3"
                      key={index}
                    >
                      <div className=" gap-3 flex items-center">
                        <Image
                          className="rounded-full"
                          src={thisCurrency.flag}
                          width={20}
                          height={20}
                          alt=""
                        />

                        <p className="text-preset-4">{code}</p>

                        <p className="text-preset-5 text-neutral-200">
                          {thisCurrency.name}
                        </p>
                      </div>

                      {currentCurrency === code && (
                        <Icon name="check" size={12} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrencySelector;
