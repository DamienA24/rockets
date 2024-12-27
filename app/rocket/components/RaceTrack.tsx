import { RaceTrackProps } from "../types/index";

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
          <div className="flex-1 h-8 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                rocket1Exploded
                  ? "bg-red-500"
                  : isRocket1Winner
                  ? "bg-blue-500 animate-pulse"
                  : "bg-blue-500"
              }`}
              style={{ width: `${rocket1Progress}%` }}
            />
          </div>
          <span className="w-16 text-right">{rocket1Progress}%</span>
        </div>
        {rocket1Exploded && (
          <p className="text-red-500 text-sm">💥 Rocket exploded!</p>
        )}
        {isRocket1Winner && (
          <p className="text-green-500 text-sm animate-bounce">🎉 Winner! 🎊</p>
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
          <div className="flex-1 h-8 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                rocket2Exploded
                  ? "bg-red-500"
                  : isRocket2Winner
                  ? "bg-green-500 animate-pulse"
                  : "bg-green-500"
              }`}
              style={{ width: `${rocket2Progress}%` }}
            />
          </div>
          <span className="w-16 text-right">{rocket2Progress}%</span>
        </div>
        {rocket2Exploded && (
          <p className="text-red-500 text-sm">💥 Rocket exploded!</p>
        )}
        {isRocket2Winner && (
          <p className="text-green-500 text-sm animate-bounce">🎉 Winner! 🎊</p>
        )}
      </div>
    </div>
  );
}
