import { useCurrencies } from "@/lib/currenciesStore";
import LogItem from "./LogItem";
import ErrorMessage from "./ErrorMessage";

const Logs = () => {
  const logs = useCurrencies((s) => s.logs);
  const clearLogs = useCurrencies((s) => s.clearLogs);
  if (logs.length === 0)
    return (
      <ErrorMessage
        label="No conversions logged yet"
        text="Every conversion is recorded here automatically when you tap LOG CONVERSION. Your log is private to this session and this browser."
      />
    );

  return (
    <div className="rounded-16 flex w-full flex-col gap-4 border border-neutral-600 bg-neutral-700 p-4">
      <div className="flex w-full flex-col justify-between gap-2.5 uppercase md:flex-row md:items-center md:gap-0">
        <h2 className="text-preset-3-medium">Conversion log</h2>

        <div className="flex items-center justify-between gap-2">
          <p className="text-preset-5 text-neutral-200 uppercase">
            {logs.length} Logged
          </p>

          <button
            onClick={clearLogs}
            className="text-preset-5 rounded-8 cursor-pointer border border-neutral-400 bg-neutral-600 px-3 py-2 text-neutral-200 uppercase transition-colors hover:bg-neutral-500 focus-visible:outline-1 focus-visible:outline-offset-[2.5px] focus-visible:outline-lime-500"
          >
            Clear all
          </button>
        </div>
      </div>

      <ul className="flex flex-col gap-3">
        {logs.map((log) => (
          <LogItem
            key={log.id}
            id={log.id}
            sendAmount={log.sendAmount}
            pair={log.pair}
            timestamp={log.timestamp}
            receiveAmount={log.receiveAmount}
          />
        ))}
      </ul>
    </div>
  );
};

export default Logs;
