const Favorites = () => {
  return (
    <div className="flex w-full flex-col gap-4 border border-neutral-600 rounded-16 bg-neutral-700 p-4">
      <div className="flex w-full items-center justify-between uppercase">
        <p className="text-preset-3-medium">Pinned pairs</p>

        <p className="text-preset-5">10 Favorites</p>
      </div>
    </div>
  );
};

export default Favorites;
