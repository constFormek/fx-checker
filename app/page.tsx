import Converter from "@/components/Converter";

export default async function Home() {
  return (
    <div className="flex flex-col bg-neutral-900 font-jetbrains-mono w-screen h-screen overflow-hidden items-center justify-center">
      <h1 className="font-jetbrains-mono">CHECK THE RATE</h1>

      <Converter />
    </div>
  );
}
