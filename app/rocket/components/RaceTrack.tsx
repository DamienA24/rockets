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
    <div className="w-full space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <span
            className={`w-24 text-sm font-medium ${
              isRocket1Winner ? "animate-bounce" : ""
            }`}
          >
            {rocket1Name} {isRocket1Winner && "🏆"}
          </span>
          <div className="flex-1">
            <Progress
              value={rocket1Progress}
              className={rocket1Exploded ? "bg-destructive/20" : "bg-secondary/20"}
              indicatorClassName={
                rocket1Exploded
                  ? "bg-destructive"
                  : isRocket1Winner
                  ? "bg-primary animate-pulse"
                  : "bg-primary"
              }
            />
          </div>
          <span className="w-16 text-right">{rocket1Progress}%</span>
        </div>
        {rocket1Exploded && (
          <p className="text-destructive text-sm">💥 Rocket exploded!</p>
        )}
        {isRocket1Winner && (
          <p className="text-primary text-sm animate-bounce">🎉 Winner! 🎊</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <span
            className={`w-24 text-sm font-medium ${
              isRocket2Winner ? "animate-bounce" : ""
            }`}
          >
            {rocket2Name} {isRocket2Winner && "🏆"}
          </span>
          <div className="flex-1">
            <Progress
              value={rocket2Progress}
              className={rocket2Exploded ? "bg-destructive/20" : "bg-secondary/20"}
              indicatorClassName={
                rocket2Exploded
                  ? "bg-destructive"
                  : isRocket2Winner
                  ? "bg-primary animate-pulse"
                  : "bg-primary"
              }
            />
          </div>
          <span className="w-16 text-right">{rocket2Progress}%</span>
        </div>
        {rocket2Exploded && (
          <p className="text-destructive text-sm">💥 Rocket exploded!</p>
        )}
        {isRocket2Winner && (
          <p className="text-primary text-sm animate-bounce">🎉 Winner! 🎊</p>
        )}
      </div>
    </div>
  );
}
