import { Kalam } from "next/font/google";

const kalam = Kalam({ subsets: ["latin"], weight: ["400"] });

interface InputProps {
  title: string;
  value: string;
}

export default function ReserveCard({ title, value }: InputProps) {
  return (
    <div
      className="w-full bg-[#EFEEEE] border border-[#75747420] rounded-2xl shadow-lg p-4 text-center space-y-2"
      aria-label={`${title} card`}
    >
      <div className="text-[#183D3D] font-medium text-lg">{title}</div>
      <div className={`${kalam.className} text-[#040D12] text-3xl font-bold`}>
        {value}
      </div>
    </div>
  );
}
