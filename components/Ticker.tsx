const Ticker = () => {
  return (
    <div className="text-preset-6 md:text-preset-5-medium flex items-center">
      <div className="flex items-center gap-2 bg-lime-500 px-2 py-3 text-neutral-900 uppercase md:px-4 md:py-3">
        <div className="aspect-square w-1.5 rounded-full bg-neutral-900"></div>

        <p>Live markets</p>
      </div>
    </div>
  );
};

export default Ticker;
