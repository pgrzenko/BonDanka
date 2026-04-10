import type { ComparisonResult } from "../lib/bondTypes.ts";
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

export function Result({
  result,
  amount,
  horizonYears,
  onRestart,
}: ResultProps) {
  const { coi, edo, winner, reason } = result;
  const isCoiWinner = winner === "COI";

  const earlyParts: string[] = [];
  if (coi.earlyFee)
    earlyParts.push(
      `COI — wykup przed 4 latami kosztuje ${fmt((amount / 100) * 2)} zł`
    );
  if (edo.earlyFee)
    earlyParts.push(
      `EDO — wykup przed 10 latami kosztuje ${fmt((amount / 100) * 3)} zł`
    );

  return (
    <div>
      {/* Recommendation box */}
      <div
        className={`rounded-xl p-5 mb-4 border ${
          isCoiWinner
            ? "bg-blue-50 border-blue-200"
            : "bg-emerald-50 border-emerald-200"
        }`}
      >
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
          Rekomendacja
        </div>
        <div className="text-[22px] font-medium mb-2">
          🏆 {winner} —{" "}
          {winner === "COI" ? "obligacje 4-letnie" : "obligacje 10-letnie"}
        </div>
        <div className="text-sm leading-relaxed text-gray-500">{reason}</div>
      </div>

      {/* Chart */}
      <BondChart
        coiYearly={coi.yearly.slice(0, horizonYears)}
        edoYearly={edo.yearly.slice(0, horizonYears)}
        horizonYears={horizonYears}
      />

      {/* Comparison cards */}
      <div className="grid grid-cols-2 gap-3 my-4">
        <div
          className={`bg-gray-50 rounded-lg p-4 ${
            isCoiWinner ? "border-2 border-blue-400" : ""
          }`}
        >
          <div className="text-xs text-gray-500 mb-1">COI (4-letnie)</div>
          <div className="text-lg font-medium">{fmt(coi.finalNetto)} zł</div>
          <div className="text-[13px] text-gray-500 mt-0.5">
            zysk netto: +{fmt(coi.profit)} zł
          </div>
        </div>
        <div
          className={`bg-gray-50 rounded-lg p-4 ${
            !isCoiWinner ? "border-2 border-blue-400" : ""
          }`}
        >
          <div className="text-xs text-gray-500 mb-1">EDO (10-letnie)</div>
          <div className="text-lg font-medium">{fmt(edo.finalNetto)} zł</div>
          <div className="text-[13px] text-gray-500 mt-0.5">
            zysk netto: +{fmt(edo.profit)} zł
          </div>
        </div>
      </div>

      {/* Early redemption warning */}
      {earlyParts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4 text-[13px] text-amber-700 leading-relaxed">
          ⚠️ Przy wcześniejszym wykupie: {earlyParts.join("; ")}.
        </div>
      )}

      {/* Restart button */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={onRestart}
          className="flex-1 py-2.5 px-5 rounded-lg text-[15px] bg-gray-900 text-white hover:opacity-85 transition-all cursor-pointer"
        >
          Zacznij od nowa
        </button>
      </div>
    </div>
  );
}
