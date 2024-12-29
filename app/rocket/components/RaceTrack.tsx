import { RaceTrackProps } from "../types/index";
import { Progress } from "./ui/Progress";

export default function RaceTrack({
  rocket1Progress,
  rocket2Progress,
  rocket1Exploded,
  rocket2Exploded,
  rocket1Name,
  rocket2Name,
}: RaceTrackProps) {
  const isRocket1Winner = rocket1Progress === 100 && !rocket1Exploded;
  const isRocket2Winner = rocket2Progress === 100 && !rocket2Exploded;

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2 sm:gap-4">
          <span
            className={`w-16 sm:w-24 text-xs sm:text-sm font-medium truncate ${
              isRocket1Winner ? "animate-bounce" : ""
            }`}
          >
            {rocket1Name} {isRocket1Winner && "🏆"}
          </span>
          <div className="flex-1">
            <Progress
              value={rocket1Progress}
              className={
                rocket1Exploded ? "bg-destructive/20" : "bg-secondary/20"
              }
              indicatorClassName={
                rocket1Exploded
                  ? "bg-destructive"
                  : isRocket1Winner
                  ? "bg-primary animate-pulse"
                  : "bg-blue-500"
              }
            />
          </div>
          <span className="w-12 sm:w-16 text-xs sm:text-sm text-right">
            {rocket1Progress}%
          </span>
        </div>
        {rocket1Exploded && (
          <p className="text-destructive text-xs sm:text-sm">
            💥 Rocket exploded!
          </p>
        )}
        {isRocket1Winner && (
          <p className="text-primary text-xs sm:text-sm animate-bounce">
            🎉 Winner! 🎊
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 sm:gap-4">
          <span
            className={`w-16 sm:w-24 text-xs sm:text-sm font-medium truncate ${
              isRocket2Winner ? "animate-bounce" : ""
            }`}
          >
            {rocket2Name} {isRocket2Winner && "🏆"}
          </span>
          <div className="flex-1">
            <Progress
              value={rocket2Progress}
              className={
                rocket2Exploded ? "bg-destructive/20" : "bg-secondary/20"
              }
              indicatorClassName={
                rocket2Exploded
                  ? "bg-destructive"
                  : isRocket2Winner
                  ? "bg-primary animate-pulse"
                  : "bg-yellow-500"
              }
            />
          </div>
          <span className="w-12 sm:w-16 text-xs sm:text-sm text-right">
            {rocket2Progress}%
          </span>
        </div>
        {rocket2Exploded && (
          <p className="text-destructive text-xs sm:text-sm">
            💥 Rocket exploded!
          </p>
        )}
        {isRocket2Winner && (
          <p className="text-primary text-xs sm:text-sm animate-bounce">
            🎉 Winner! 🎊
          </p>
        )}
      </div>
    </div>
  );
}
