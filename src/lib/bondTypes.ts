/** Typ obligacji: COI (4-letnie) lub EDO (10-letnie) */
export type BondType = "COI" | "EDO";

/** Dane wejściowe kalkulatora */
export interface CalcInput {
  /** Kwota inwestycji w PLN (wielokrotność 100) */
  amount: number;
  /** Horyzont inwestycyjny w latach (1-15) */
  horizonYears: number;
  /** Oczekiwana roczna stopa inflacji (np. 0.035 = 3,5%) */
  inflationRate: number;
  /** Oprocentowanie konta oszczędnościowego (np. 0.035 = 3,5%) */
  savingsRate: number;
}

/** Wynik roczny dla jednego typu obligacji */
export interface YearlyData {
  year: number;
  value: number;
}

/** Wynik kalkulacji dla jednego typu obligacji */
export interface BondResult {
  /** Wartość netto po horyzoncie (po podatku i ewentualnych opłatach) */
  finalNetto: number;
  /** Zysk netto (finalNetto - amount) */
  profit: number;
  /** Czy wykup odbywa się przed terminem (opłata za wcześniejszy wykup) */
  earlyFee: boolean;
  /** Dane roczne do wykresu */
  yearly: YearlyData[];
}

/** Wynik porównania obu typów obligacji */
export interface ComparisonResult {
  coi: BondResult;
  edo: BondResult;
  /** Rekomendowany typ obligacji */
  winner: BondType;
  /** Uzasadnienie rekomendacji */
  reason: string;
}

/** Stan wizarda */
export interface WizardState {
  step: 1 | 2 | 3 | 4 | "result";
  horizonYears: number;
  amount: number;
  inflationRate: number;
  savingsRate: number;
}
