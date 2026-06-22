import Converter from "@/components/Converter";
import { fetchExchangeRate } from "@/lib/fetchExchangeRate";

export default async function Home() {
  const base = "USD";
  const symbol = "EUR";
  const initialExchangeData = await fetchExchangeRate({
    base: base,
    symbol: symbol,
  });
  return (
    <div className="flex flex-col bg-neutral-900 font-jetbrains-mono w-screen h-screen overflow-hidden items-center justify-center">
      <h1 className="font-jetbrains-mono">CHECK THE RATE</h1>

      <Converter
        base={base}
        symbol={symbol}
        initialExchangeRate={initialExchangeData.rates[symbol]}
      />
    </div>
  );
}
