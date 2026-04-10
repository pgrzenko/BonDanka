import { BOND_CONSTANTS } from "./bondConstants.ts";
import type {
  BondType,
  BondResult,
  CalcInput,
  ComparisonResult,
  YearlyData,
} from "./bondTypes.ts";

/**
 * Oblicza wynik inwestycji dla danego typu obligacji.
 * Logika 1:1 z funkcją calcBond() z pliku referencyjnego.
 *
 * COI: odsetki wypłacane co rok (brak kapitalizacji w sensie reinwestycji,
 *      ale w uproszczonym modelu referencyjnym stosujemy tę samą formułę
 *      compound — bo kalkulator referencyjny tak robi).
 * EDO: odsetki kapitalizowane rocznie.
 *
 * @param type - typ obligacji ("COI" | "EDO")
 * @param input - dane wejściowe (amount, horizonYears, inflationRate)
 * @returns wynik kalkulacji z danymi rocznymi
 */
export function calcBond(type: BondType, input: CalcInput): BondResult {
  const { amount, horizonYears, inflationRate } = input;
  const bond = BOND_CONSTANTS[type];
  const bonds = amount / 100;
  const term = bond.termYears;
  const MAX = Math.max(horizonYears, term);
  const yearly: YearlyData[] = [];

  let capital = amount;
  for (let y = 1; y <= MAX; y++) {
    if (y === 1) {
      capital *= 1 + bond.year1Rate;
    } else {
      capital *= 1 + inflationRate + bond.inflationMargin;
    }

    let netVal: number;
    if (y === horizonYears) {
      if (y < term) {
        // Wcześniejszy wykup — opłata
        const fee = bonds * bond.earlyRedemptionFee;
        const valAfterFee = capital - fee;
        const profit = Math.max(valAfterFee - amount, 0);
        const tax = profit * BOND_CONSTANTS.TAX.belka;
        netVal = valAfterFee - tax;
      } else {
        // Wykup w terminie lub po terminie — bez opłaty
        const profit = Math.max(capital - amount, 0);
        const tax = profit * BOND_CONSTANTS.TAX.belka;
        netVal = capital - tax;
      }
    } else {
      netVal = capital;
    }

    yearly.push({ year: y, value: Math.round(netVal) });
  }

  const finalNetto = yearly[horizonYears - 1].value;
  const earlyFee = horizonYears < term;

  return {
    finalNetto,
    profit: finalNetto - amount,
    earlyFee,
    yearly,
  };
}

/**
 * Porównuje COI i EDO dla danych wejściowych i zwraca rekomendację.
 *
 * @param input - dane wejściowe (amount, horizonYears, inflationRate)
 * @returns wynik porównania z rekomendacją
 */
export function calcBonds(input: CalcInput): ComparisonResult {
  const coi = calcBond("COI", input);
  const edo = calcBond("EDO", input);

  const winner: BondType = coi.finalNetto >= edo.finalNetto ? "COI" : "EDO";

  const { horizonYears } = input;
  let reason: string;

  if (horizonYears <= 3) {
    reason = `Dla horyzontu ${horizonYears} ${horizonYears === 1 ? "roku" : "lat"} COI to lepszy wybór. EDO trwają 10 lat — wcześniejszy wykup kosztuje 3 zł od każdych 100 zł i bardzo obniża zysk.`;
  } else if (horizonYears === 4) {
    reason =
      "COI to idealny wybór — kończą się dokładnie wtedy, kiedy potrzebujesz pieniędzy. Żadnych opłat za wykup, pełny zysk.";
  } else if (horizonYears >= 5 && horizonYears < 10) {
    reason = `EDO dają wyższą marżę ponad inflację (2% vs 1,5% przy COI), co przez ${horizonYears} lat robi znaczącą różnicę. COI musisz po 4 latach reinwestować, co wiąże się z ryzykiem gorszych warunków.`;
  } else {
    reason = `EDO idealnie wpisują się w Twój horyzont ${horizonYears} lat. Trzymasz do końca — żadnych opłat, pełna marża 2% ponad inflację przez cały czas.`;
  }

  return { coi, edo, winner, reason };
}

/*
 * ===== TEST ASSERTIONS (verify manually) =====
 *
 * calcBonds({ amount: 100000, horizonYears: 3,  inflationRate: 0.035 })
 *   → winner: "COI"
 *
 * calcBonds({ amount: 100000, horizonYears: 6,  inflationRate: 0.035 })
 *   → winner: "EDO"
 *
 * calcBonds({ amount: 100000, horizonYears: 4,  inflationRate: 0.035 })
 *   → winner: "COI", coi.earlyFee === false
 *
 * calcBonds({ amount: 100000, horizonYears: 10, inflationRate: 0.035 })
 *   → winner: "EDO", edo.earlyFee === false
 */
