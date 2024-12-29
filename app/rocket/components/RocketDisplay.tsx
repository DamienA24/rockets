import { RocketDisplayProps } from "../types/index";
import Image from "next/image";

export default function RocketDisplay({
  progress,
  exploded,
  isWinner,
  rocketInfo,
}: RocketDisplayProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="relative w-8 h-8">
          <Image
            src={rocketInfo.image}
            alt={rocketInfo.name}
            fill
            className="object-cover rounded"
          />
        </div>
        <p className="font-medium">
          {rocketInfo.name}
          {isWinner && " 🏆"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              exploded
                ? "bg-red-500"
                : isWinner
                ? "bg-green-500"
                : "bg-blue-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm font-medium">{progress}%</span>
      </div>
      {exploded && <p className="text-red-500 text-sm">💥 Explosion !</p>}
    </div>
  );
}
