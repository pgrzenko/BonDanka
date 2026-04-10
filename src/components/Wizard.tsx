import { useState } from "react";
import type { WizardState, ComparisonResult } from "../lib/bondTypes.ts";
import { calcBonds } from "../lib/bondCalculator.ts";
import { StepHorizon } from "./StepHorizon.tsx";
import { StepAmount } from "./StepAmount.tsx";
import { StepInflation } from "./StepInflation.tsx";
import { Result } from "./Result.tsx";

const INITIAL_STATE: WizardState = {
  step: 1,
  horizonYears: 5,
  amount: 100000,
  inflationRate: 0.035,
};

export function Wizard() {
  const [state, setState] = useState<WizardState>(INITIAL_STATE);
  const [result, setResult] = useState<ComparisonResult | null>(null);

  const currentStep = state.step;
  const stepIndex = currentStep === "result" ? 3 : currentStep;

  function goTo(step: WizardState["step"]) {
    setState((s) => ({ ...s, step }));
  }

  function handleCalc() {
    const res = calcBonds({
      amount: state.amount,
      horizonYears: state.horizonYears,
      inflationRate: state.inflationRate,
    });
    setResult(res);
    goTo("result");
  }

  function handleRestart() {
    setState(INITIAL_STATE);
    setResult(null);
  }

  return (
    <div className="max-w-[560px] mx-auto px-4 py-6">
      {/* Progress dots */}
      <div className="flex gap-1.5 mb-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i <= stepIndex ? "bg-gray-900" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {currentStep === 1 && (
        <StepHorizon
          value={state.horizonYears}
          onChange={(v) => setState((s) => ({ ...s, horizonYears: v }))}
          onNext={() => goTo(2)}
        />
      )}

      {currentStep === 2 && (
        <StepAmount
          value={state.amount}
          onChange={(v) => setState((s) => ({ ...s, amount: v }))}
          onBack={() => goTo(1)}
          onNext={() => goTo(3)}
        />
      )}

      {currentStep === 3 && (
        <StepInflation
          value={state.inflationRate}
          onChange={(v) => setState((s) => ({ ...s, inflationRate: v }))}
          onBack={() => goTo(2)}
          onCalc={handleCalc}
        />
      )}

      {currentStep === "result" && result && (
        <Result
          result={result}
          amount={state.amount}
          horizonYears={state.horizonYears}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
