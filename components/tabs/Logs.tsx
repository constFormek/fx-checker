import { useCurrencies } from "@/lib/currenciesStore";
import LogItem from "./LogItem";

const Logs = () => {
  const logs = useCurrencies((s) => s.logs);
  const clearLogs = useCurrencies((s) => s.clearLogs);
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <h3 className="text-preset-2 text-neutral-100">
          No conversions logged yet
        </h3>

        <p className="text-preset-4 max-w-115 text-neutral-200">
          Every conversion is recorded here automatically when you tap LOG
          CONVERSION.
          <br />
          Your log is private to this session and this browser
        </p>
      </div>
    );
  }
  return (
    <div className="rounded-16 flex w-full flex-col gap-4 border border-neutral-600 bg-neutral-700 p-4">
      <div className="flex w-full items-center justify-between uppercase">
        <p className="text-preset-3-medium">Conversion log</p>

        <div className="flex items-center justify-between">
          <p className="text-preset-5">{logs.length} LOGGED</p>

          <button
            onClick={clearLogs}
            className="text-preset-5 rounded-8 border border-neutral-400 bg-neutral-600 px-3 py-2 text-neutral-200 uppercase"
          >
            Clear all
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {logs.map((entry) => (
          <LogItem
            key={entry.id}
            id={entry.id}
            sendAmount={entry.sendAmount}
            pair={entry.pair}
            timestamp={entry.timestamp}
            receiveAmount={entry.receiveAmount}
          />
        ))}
      </div>
    </div>
  );
};

export default Logs;
