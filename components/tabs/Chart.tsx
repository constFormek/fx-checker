interface ChartProps {
  chartData: {
    x: number;
    y: number;
  }[];
  width: number;
  height: number;
}
const Chart = ({ chartData, width, height }: ChartProps) => {
  const pathString = chartData
    .map((entry, index) => {
      if (index === 0) return `M ${entry.x} ${entry.y}`;

      return `L ${entry.x} ${entry.y}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`}>
      <path
        d={pathString}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeWidth={2}
        className="stroke-lime-500"
      ></path>
    </svg>
  );
};

export default Chart;
