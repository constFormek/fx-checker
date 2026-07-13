import Image from "next/image";

import logoPath from "@/public/images/logo.svg";
import Ticker from "./Ticker";

interface HeaderProps {
  currenciesCount: number;
}
const Header = ({ currenciesCount }: HeaderProps) => {
  return (
    <header className="flex w-full flex-col">
      <h1 className="sr-only">Foreign currency converter</h1>
      <div className="flex justify-between p-4 md:px-6 md:py-5">
        <Image
          src={logoPath}
          width={140}
          height={26}
          alt="logo"
          className="hidden md:block"
        />

        <Image
          src={logoPath}
          width={100}
          height={20}
          alt="logo"
          className="block md:hidden"
        />
        <div className="text-preset-6 md:text-preset-4 flex items-center text-neutral-200">
          <p className="before:mx-2 not-first:before:content-['·']">
            {currenciesCount} CURRENCIES
          </p>

          <p className="before:mx-2 not-first:before:content-['·']">EOD</p>

          <p className="before:mx-2 not-first:before:content-['·']">ECB DATA</p>
        </div>
      </div>

      <Ticker />
    </header>
  );
};

export default Header;
