import { RocketDisplayProps } from "../types/index";
import Image from "next/image";
import { Progress } from "./ui/Progress";

export default function RocketDisplay({
  progress,
  exploded,
  isWinner,
  rocketInfo,
}: RocketDisplayProps) {
  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative w-6 h-6 sm:w-8 sm:h-8">
          <Image
            src={rocketInfo.image}
            alt={rocketInfo.name}
            fill
            className="object-cover rounded"
          />
        </div>
        <p className="font-medium text-sm sm:text-base truncate">
          {rocketInfo.name}
          {isWinner && " 🏆"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Progress
            value={progress}
            className="bg-white"
            indicatorClassName={
              exploded
                ? "bg-destructive"
                : isWinner
                ? "bg-primary"
                : "bg-blue-500"
            }
          />
        </div>
        <span className="text-xs sm:text-sm font-medium min-w-[3rem] text-right">{progress}%</span>
      </div>
      {exploded && <p className="text-destructive text-xs sm:text-sm">💥 Explosion !</p>}
    </div>
  );
}
