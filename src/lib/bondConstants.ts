// BonDanka — Bond Constants
// Source: marciniwuc.com/obligacje-indeksowane-inflacja-kalkulator/
// Cross-referenced: obligacjeskarbowe.pl, analizy.pl, subiektywnieofinansach.pl
// Last updated: 2026-04-10 (emisja kwiecień 2026)

export const BOND_CONSTANTS = {
  COI: {
    year1Rate: 0.0475, // 4,75% rok 1
    inflationMargin: 0.015, // CPI + 1,5% lata 2-4
    earlyRedemptionFee: 2, // 2 zł per obligację (100 zł nominał)
    termYears: 4,
  },
  EDO: {
    year1Rate: 0.0535, // 5,35% rok 1
    inflationMargin: 0.02, // CPI + 2,0% lata 2-10
    earlyRedemptionFee: 3, // 3 zł per obligację
    termYears: 10,
  },
  TAX: { belka: 0.19 }, // podatek Belki
} as const;
