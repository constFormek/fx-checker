import Converter from "@/components/converter/Converter";
import CurrencyHydrator from "@/components/CurrencyHydrator";
import Header from "@/components/Header";
import Tabs from "@/components/tabs/Tabs";
import { INITIAL_PAIR } from "@/lib/constants";
import { fetchCurrenciesData, fetchExchangeRate } from "@/lib/currencyApi";
import { readdirSync } from "fs";

import path from "path";

export default async function Home() {
  const initialData = await fetchExchangeRate({
    base: INITIAL_PAIR.base,
    quote: INITIAL_PAIR.quote,
  });
  const flagFiles = readdirSync(
    path.join(process.cwd(), "public/images/flags"),
  );
  const supportedCountryCodes = flagFiles.map((f) => f.replace(".webp", ""));

  const currenciesData = await fetchCurrenciesData();

  const supportedCurrencies = currenciesData
    .filter((c) =>
      supportedCountryCodes.includes(
        c.iso_code.slice(0, 2).toLocaleLowerCase(),
      ),
    )
    .map((c) => {
      return {
        iso_code: c.iso_code,
        name: c.name,
        flag: `/images/flags/${c.iso_code.slice(0, 2).toLocaleLowerCase()}.webp`,
      };
    });
  return (
    <>
      <Header currenciesCount={supportedCurrencies.length} />

      <div className="mx-auto flex max-w-260 flex-col place-content-center place-items-center content-center items-center justify-center gap-10 px-4 py-8 md:px-6 md:py-12 lg:gap-8 lg:px-8 lg:py-12">
        <div className="font-jetbrains-mono flex w-full flex-col gap-4 bg-neutral-900">
          <h2 className="font-jetbrains-mono text-preset-2 uppercase">
            Check the rate
          </h2>
          <Converter initialRate={initialData.rate} />
        </div>

        <Tabs />
      </div>

      <CurrencyHydrator availableCurrencies={supportedCurrencies} />
    </>
  );
}
