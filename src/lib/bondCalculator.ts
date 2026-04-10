import { BOND_CONSTANTS } from "./bondConstants.ts";
import type {
  BondType,
  BondResult,
  CalcInput,
  ComparisonResult,
  YearlyData,
} from "./bondTypes.ts";

const TAX_RATE = BOND_CONSTANTS.TAX.belka;

/**
 * Calculates COI (4-year) bond portfolio value over time.
 *
 * COI mechanics:
 * - Year 1 of each 4-year series: fixed rate (4.75%)
 * - Years 2-4: CPI inflation + 1.50% margin
 * - Interest is PAID OUT annually to investor's savings account (not capitalized)
 * - Bond capital always equals the nominal (100 zł per bond)
 * - Paid-out interest is reinvested at the savings account rate (after Belka tax)
 * - Early redemption (before 4 years): fee of 2.00 zł per bond
 * - Belka tax (19%) deducted from each annual interest payment
 * - At maturity (year 4), nominal is returned and reinvested into new COI series
 *
 * For each year the chart shows the hypothetical net value if cashed out that year:
 * - Maturity year (4, 8, 12...): nominal + savings (all interest already paid)
 * - Other years: bond redemption value (nominal + accrued interest - fee - tax) + savings
 *
 * @param input - amount, horizonYears, inflationRate, savingsRate
 * @returns BondResult with finalNetto, profit, earlyFee flag, and yearly chart data
 */
export function calcCOI(input: CalcInput): BondResult {
  const { amount, horizonYears, inflationRate, savingsRate } = input;
  const { year1Rate, inflationMargin, earlyRedemptionFee, termYears } =
    BOND_CONSTANTS.COI;

  const bondsCount = amount / 100;
  const fee = bondsCount * earlyRedemptionFee;
  const netSavingsRate = savingsRate * (1 - TAX_RATE);
  const maxYear = Math.max(horizonYears, BOND_CONSTANTS.EDO.termYears);
  const yearly: YearlyData[] = [];

  let savings = 0;

  for (let y = 1; y <= maxYear; y++) {
    const seriesYear = ((y - 1) % termYears) + 1;
    const rate =
      seriesYear === 1
        ? year1Rate
        : Math.max(0, inflationRate) + inflationMargin;
    const interestBrutto = amount * rate;
    const interestNetto = interestBrutto * (1 - TAX_RATE);

    // Savings from previous periods grow
    savings *= 1 + netSavingsRate;

    // Compute hypothetical net value if cashed out this year
    let netValue: number;
    if (seriesYear === termYears) {
      // Maturity year — interest paid out, bond returns nominal
      netValue = amount + savings + interestNetto;
    } else {
      // Early redemption — accrued interest stays with bond, fee applies
      // First period: fee capped at accrued interest (nominal protection)
      const effectiveFee =
        seriesYear === 1 ? Math.min(fee, interestBrutto) : fee;
      const bondValue = amount + interestBrutto - effectiveFee;
      const gain = Math.max(bondValue - amount, 0);
      const tax = gain * TAX_RATE;
      netValue = bondValue - tax + savings;
    }

    yearly.push({ year: y, value: Math.round(netValue) });

    // Running savings: interest is always paid out for path continuation
    savings += interestNetto;
  }

  const finalNetto = yearly[horizonYears - 1].value;

  return {
    finalNetto,
    profit: finalNetto - amount,
    earlyFee: horizonYears % termYears !== 0,
    yearly,
  };
}

/**
 * Calculates EDO (10-year) bond portfolio value over time.
 *
 * EDO mechanics:
 * - Year 1 of each 10-year series: fixed rate (5.35%)
 * - Years 2-10: CPI inflation + 2.00% margin
 * - Interest is CAPITALIZED annually (compound interest — added to principal)
 * - Early redemption (before 10 years): fee of 3.00 zł per bond
 * - Belka tax (19%) deducted only at redemption from total gain
 * - At maturity (year 10), proceeds are reinvested into a new EDO series
 *
 * For each year the chart shows the hypothetical net value if cashed out that year:
 * - Before maturity: capital - fee - tax on (capital - fee - invested)
 * - At maturity: capital - tax on (capital - invested)
 *
 * @param input - amount, horizonYears, inflationRate, savingsRate (unused for EDO)
 * @returns BondResult with finalNetto, profit, earlyFee flag, and yearly chart data
 */
export function calcEDO(input: CalcInput): BondResult {
  const { amount, horizonYears, inflationRate } = input;
  const { year1Rate, inflationMargin, earlyRedemptionFee, termYears } =
    BOND_CONSTANTS.EDO;

  const maxYear = Math.max(horizonYears, termYears);
  const yearly: YearlyData[] = [];

  let capital = amount;
  let investedBase = amount; // tracks cost basis for tax after reinvestment

  for (let y = 1; y <= maxYear; y++) {
    const seriesYear = ((y - 1) % termYears) + 1;

    if (seriesYear === 1) {
      capital *= 1 + year1Rate;
    } else {
      capital *= 1 + Math.max(0, inflationRate) + inflationMargin;
    }

    const currentBondsCount = investedBase / 100;
    const fee = currentBondsCount * earlyRedemptionFee;

    // Compute hypothetical net value if cashed out this year
    let netValue: number;
    if (seriesYear < termYears) {
      // Early redemption — fee capped at accrued interest (nominal protection)
      const accruedInterest = Math.max(capital - investedBase, 0);
      const effectiveFee = Math.min(fee, accruedInterest);
      const valueAfterFee = capital - effectiveFee;
      const gain = Math.max(valueAfterFee - investedBase, 0);
      const tax = gain * TAX_RATE;
      netValue = valueAfterFee - tax;
    } else {
      // Maturity — no fee
      const gain = Math.max(capital - investedBase, 0);
      const tax = gain * TAX_RATE;
      netValue = capital - tax;
    }

    yearly.push({ year: y, value: Math.round(netValue) });

    // Handle actual maturity for reinvestment into next series
    if (seriesYear === termYears && y < maxYear) {
      const gain = Math.max(capital - investedBase, 0);
      const tax = gain * TAX_RATE;
      capital = capital - tax;
      investedBase = capital;
    }
  }

  const finalNetto = yearly[horizonYears - 1].value;

  return {
    finalNetto,
    profit: finalNetto - amount,
    earlyFee: horizonYears % termYears !== 0,
    yearly,
  };
}

/**
 * Compares COI and EDO bonds for the given inputs and returns a recommendation.
 *
 * @param input - amount, horizonYears, inflationRate, savingsRate
 * @returns ComparisonResult with both outcomes, winner, and reason
 */
export function calcBonds(input: CalcInput): ComparisonResult {
  const coi = calcCOI(input);
  const edo = calcEDO(input);

  const winner: BondType = coi.finalNetto >= edo.finalNetto ? "COI" : "EDO";

  const { horizonYears } = input;
  const diff = Math.abs(coi.finalNetto - edo.finalNetto);
  const fmtDiff = diff.toLocaleString("pl-PL", { maximumFractionDigits: 0 });

  let reason: string;

  if (winner === "COI") {
    if (horizonYears <= 3) {
      reason = `Dla horyzontu ${horizonYears} ${horizonYears === 1 ? "roku" : "lat"} COI wygrywa o ${fmtDiff} zł. EDO trwają 10 lat — wcześniejszy wykup kosztuje 3 zł od każdych 100 zł i obniża zysk.`;
    } else if (horizonYears === 4) {
      reason = `COI kończy się dokładnie w Twoim horyzoncie — zero opłat za wcześniejszy wykup, pełny zysk. Przewaga nad EDO: ${fmtDiff} zł.`;
    } else {
      reason = `COI z reinwestycją daje lepszy wynik o ${fmtDiff} zł dzięki wypłacanym odsetkom reinwestowanym na koncie oszczędnościowym.`;
    }
  } else {
    if (horizonYears >= 5 && horizonYears < 10) {
      reason = `EDO daje wyższy zysk o ${fmtDiff} zł. Wyższa marża (2% vs 1,5%) i kapitalizacja odsetek robią różnicę przez ${horizonYears} lat.`;
    } else if (horizonYears === 10) {
      reason = `EDO idealnie wpisuje się w Twój horyzont 10 lat — trzymasz do końca, bez opłat, z pełną marżą 2% ponad inflację. Przewaga: ${fmtDiff} zł.`;
    } else {
      reason = `EDO wygrywa o ${fmtDiff} zł dzięki wyższej marży ponad inflację (2% vs 1,5%) i kapitalizacji odsetek.`;
    }
  }

  return { coi, edo, winner, reason };
}

/*
 * ===== TEST ASSERTIONS (verify manually) =====
 * (savingsRate: 0.035 assumed for all)
 *
 * calcBonds({ amount: 100000, horizonYears: 1,  inflationRate: 0.035, savingsRate: 0.035 })
 *   → winner: "COI"  (COI 102228 vs EDO 101904)
 *
 * calcBonds({ amount: 100000, horizonYears: 3,  inflationRate: 0.035, savingsRate: 0.035 })
 *   → winner: "EDO"  (EDO 111548 vs COI 110664)
 *
 * calcBonds({ amount: 100000, horizonYears: 4,  inflationRate: 0.035, savingsRate: 0.035 })
 *   → winner: "EDO", coi.earlyFee === false, edo.earlyFee === true
 *
 * calcBonds({ amount: 100000, horizonYears: 10, inflationRate: 0.035, savingsRate: 0.035 })
 *   → winner: "EDO", edo.earlyFee === false  (EDO 157163 vs COI 143756)
 */
