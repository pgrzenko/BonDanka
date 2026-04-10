import type { ComparisonResult } from "../lib/bondTypes.ts";
import { BOND_CONSTANTS } from "../lib/bondConstants.ts";
import { BondChart } from "./BondChart.tsx";

interface ResultProps {
  result: ComparisonResult;
  amount: number;
  horizonYears: number;
  onRestart: () => void;
}

function fmt(value: number): string {
  return value.toLocaleString("pl-PL", { maximumFractionDigits: 0 });
}

function pluralLat(n: number): string {
  if (n === 1) return "rokiem";
  return "latami";
}

export function Result({
  result,
  amount,
  horizonYears,
  onRestart,
}: ResultProps) {
  const { coi, edo, winner, reason } = result;
  const isCoiWinner = winner === "COI";

  const coiFee = (amount / 100) * BOND_CONSTANTS.COI.earlyRedemptionFee;
  const edoFee = (amount / 100) * BOND_CONSTANTS.EDO.earlyRedemptionFee;

  return (
    <div>
      {/* Recommendation box — full width */}
      <div
        className={`rounded-xl p-5 mb-5 border ${
          isCoiWinner
            ? "bg-blue-50 border-blue-200"
            : "bg-emerald-50 border-emerald-200"
        }`}
      >
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
          Rekomendacja
        </div>
        <div className="text-[22px] font-medium mb-2">
          Dla {horizonYears} {horizonYears === 1 ? "roku" : "lat"}: wybierz{" "}
          {winner}
        </div>
        <div className="text-sm leading-relaxed text-gray-600">{reason}</div>
      </div>

      {/* Side-by-side comparison cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {/* COI card */}
        <div
          className={`rounded-xl p-5 border-2 transition-all ${
            isCoiWinner
              ? "bg-blue-50 border-blue-300"
              : "bg-gray-50 border-gray-200 opacity-75"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-gray-700">
              COI (4-letnie)
            </div>
            {isCoiWinner && <span className="text-lg">🏆</span>}
          </div>

          <div className="text-[13px] text-gray-600 mb-0.5">Wpłacasz:</div>
          <div className="text-base font-medium mb-3">{fmt(amount)} zł</div>

          <div className="text-[13px] text-gray-600 mb-0.5">Otrzymasz:</div>
          <div className="text-xl font-semibold mb-1">
            {fmt(coi.finalNetto)} zł
          </div>

          <div className="text-[13px] text-gray-600 mb-1">
            Zysk netto:{" "}
            <span className="text-green-700 font-medium">
              +{fmt(coi.profit)} zł
            </span>
          </div>
          <div className="text-[11px] text-gray-500 mb-4">
            (po odliczeniu 19% podatku Belki)
          </div>

          {/* Growth bar */}
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div
              className={`h-full rounded-full ${
                isCoiWinner ? "bg-blue-500" : "bg-gray-400"
              }`}
              style={{
                width: `${Math.min((coi.profit / amount) * 100 * 3, 100)}%`,
              }}
            />
          </div>

          <div className="text-[12px] text-amber-800 bg-amber-50 rounded-lg p-2.5 leading-relaxed">
            ⚠️ Wykup przed {BOND_CONSTANTS.COI.termYears}{" "}
            {pluralLat(BOND_CONSTANTS.COI.termYears)}: opłata {fmt(coiFee)} zł
          </div>
        </div>

        {/* EDO card */}
        <div
          className={`rounded-xl p-5 border-2 transition-all ${
            !isCoiWinner
              ? "bg-emerald-50 border-emerald-300"
              : "bg-gray-50 border-gray-200 opacity-75"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-gray-700">
              EDO (10-letnie)
            </div>
            {!isCoiWinner && <span className="text-lg">🏆</span>}
          </div>

          <div className="text-[13px] text-gray-600 mb-0.5">Wpłacasz:</div>
          <div className="text-base font-medium mb-3">{fmt(amount)} zł</div>

          <div className="text-[13px] text-gray-600 mb-0.5">Otrzymasz:</div>
          <div className="text-xl font-semibold mb-1">
            {fmt(edo.finalNetto)} zł
          </div>

          <div className="text-[13px] text-gray-600 mb-1">
            Zysk netto:{" "}
            <span className="text-green-700 font-medium">
              +{fmt(edo.profit)} zł
            </span>
          </div>
          <div className="text-[11px] text-gray-500 mb-4">
            (po odliczeniu 19% podatku Belki)
          </div>

          {/* Growth bar */}
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div
              className={`h-full rounded-full ${
                !isCoiWinner ? "bg-emerald-500" : "bg-gray-400"
              }`}
              style={{
                width: `${Math.min((edo.profit / amount) * 100 * 3, 100)}%`,
              }}
            />
          </div>

          <div className="text-[12px] text-amber-800 bg-amber-50 rounded-lg p-2.5 leading-relaxed">
            ⚠️ Wykup przed {BOND_CONSTANTS.EDO.termYears}{" "}
            {pluralLat(BOND_CONSTANTS.EDO.termYears)}: opłata {fmt(edoFee)} zł
          </div>
        </div>
      </div>

      {/* Full-width comparison chart */}
      <BondChart
        coiYearly={coi.yearly}
        edoYearly={edo.yearly}
        horizonYears={horizonYears}
      />

      {/* Restart button */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={onRestart}
          className="flex-1 py-2 px-5 rounded-lg text-[14px] text-gray-600 border border-gray-300 hover:bg-gray-50 transition-all cursor-pointer"
        >
          Zacznij od nowa
        </button>
      </div>
    </div>
  );
}
