import Converter from "@/components/Converter";
import CurrencyHydrator from "@/components/CurrencyHydrator";
import { fetchCurrenciesData, fetchExchangeRate } from "@/lib/currencyApi";

import { readdirSync } from "fs";
import path from "path";

export default async function Home() {
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

  const initialExchangeData = await fetchExchangeRate({
    base: "USD",
    quote: "EUR",
  });
  return (
    <>
      <div className="flex flex-col bg-neutral-900 font-jetbrains-mono w-screen h-screen overflow-hidden items-center ">
        <h1 className="font-jetbrains-mono">CHECK THE RATE</h1>

        <Converter
          base={"USD"}
          quote={"EUR"}
          initialExchangeRate={initialExchangeData.rate}
        />
      </div>

      <CurrencyHydrator currencies={supportedCurrencies} />
    </>
  );
}
