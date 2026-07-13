import { ReactNode } from "react";

interface StatCardProps {
  children: ReactNode;
  label: string;
}

const StatCard = ({ children, label }: StatCardProps) => {
  return (
    <div className="rounded-16 flex flex-col gap-4 border border-neutral-600 bg-neutral-700 px-5 py-3 lg:w-35">
      <p className="text-preset-4 text-neutral-200 uppercase">{label}</p>

      {children}
    </div>
  );
};

export default StatCard;
