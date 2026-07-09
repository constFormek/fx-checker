import Icon from "./Icon";

export const stylesMap = {
  up: {
    color: "text-green-500",
    prefix: "+",
    Icon: <Icon name="chevron-down" className="h-[1em] w-[1em] rotate-180" />,
  },
  down: {
    color: "text-red-500",
    prefix: "",
    Icon: <Icon name="chevron-down" className="h-[1em] w-[1em] rotate-0" />,
  },
  flat: { color: "text-neutral-200", prefix: "", Icon: <></> },
};

export const getDirection = (change: number) => {
  return change > 0 ? "up" : change < 0 ? "down" : "flat";
};

interface changeIndicatorProps {
  changePercentage: number;
  className?: string;
}

const ChangeIndicator = ({
  changePercentage,
  className,
}: changeIndicatorProps) => {
  const direction = getDirection(changePercentage);

  return (
    <div
      className={`${stylesMap[direction].color} ${className ?? "text-preset-6"} flex items-center`}
    >
      {stylesMap[direction].Icon}

      <span>
        {stylesMap[direction].prefix}
        {changePercentage.toFixed(2)}%
      </span>
    </div>
  );
};

export default ChangeIndicator;
