import { useState } from "react";

interface StepAmountProps {
  value: number;
  onChange: (v: number) => void;
  onBack: () => void;
  onNext: () => void;
}

export function StepAmount({
  value,
  onChange,
  onBack,
  onNext,
}: StepAmountProps) {
  const [error, setError] = useState(false);

  function handleNext() {
    if (value < 100 || value % 100 !== 0) {
      setError(true);
      return;
    }
    setError(false);
    onNext();
  }

  return (
    <div>
      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
        Krok 2 z 3
      </div>
      <h2 className="text-[22px] font-medium mb-6 leading-snug">
        Ile chcesz zainwestować?
      </h2>

      <div className="my-6">
        <input
          type="number"
          min={100}
          step={100}
          value={value}
          onChange={(e) => {
            onChange(Number(e.target.value));
            setError(false);
          }}
          placeholder="np. 100000"
          className={`text-2xl font-medium w-full py-2 border-b-2 bg-transparent text-gray-900 outline-none ${
            error
              ? "border-red-500"
              : "border-gray-300 focus:border-blue-500"
          }`}
        />
        <div className="text-[13px] text-gray-500 mt-3 leading-relaxed">
          Minimalna kwota to 100 zł (1 obligacja). Podaj wielokrotność 100.
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button
          onClick={onBack}
          className="py-2.5 px-5 rounded-lg text-[15px] bg-transparent text-gray-500 border border-gray-300 hover:bg-gray-50 transition-all cursor-pointer"
        >
          ← Wróć
        </button>
        <button
          onClick={handleNext}
          className="flex-1 py-2.5 px-5 rounded-lg text-[15px] bg-gray-900 text-white hover:opacity-85 transition-all cursor-pointer"
        >
          Dalej →
        </button>
      </div>
    </div>
  );
}
