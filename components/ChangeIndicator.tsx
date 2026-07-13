import Icon from "./Icon";

const stylesMap = {
  up: {
    color: "text-green-500",
    prefix: "+",
    Icon: <Icon name="chevron-down" size={12} className="rotate-180" />,
  },
  down: {
    color: "text-red-500",
    prefix: "",
    Icon: <Icon name="chevron-down" size={12} className="rotate-0" />,
  },
  flat: { color: "text-neutral-200", prefix: "", Icon: <></> },
};

const getDirection = (change: number) => {
  return change > 0 ? "up" : change < 0 ? "down" : "flat";
};

interface changeIndicatorProps {
  changePercentage: number;
}

const ChangeIndicator = ({ changePercentage }: changeIndicatorProps) => {
  const direction = getDirection(changePercentage);

  return (
    <div
      className={`${stylesMap[direction].color} text-preset-6 flex items-center`}
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
