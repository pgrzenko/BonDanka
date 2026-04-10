interface StepSavingsProps {
  value: number;
  onChange: (v: number) => void;
  onBack: () => void;
  onCalc: () => void;
}

export function StepSavings({
  value,
  onChange,
  onBack,
  onCalc,
}: StepSavingsProps) {
  const displayVal = (value * 100).toFixed(1).replace(".", ",");

  // Slider works in 0.1% increments: 0.0% to 10.0% → internal values 0..100
  const sliderVal = Math.round(value * 1000);

  function handleSliderChange(raw: number) {
    onChange(raw / 1000);
  }

  return (
    <div>
      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
        Krok 4 z 4
      </div>
      <h2 className="text-[22px] font-medium mb-6 leading-snug">
        Jakie masz oprocentowanie konta oszczędnościowego?
      </h2>

      <div className="my-6">
        <div className="text-4xl font-medium text-gray-900 mb-3">
          {displayVal}{" "}
          <span className="text-lg font-normal text-gray-500">%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={sliderVal}
          onChange={(e) => handleSliderChange(Number(e.target.value))}
          className="w-full accent-green-700"
        />
        <div className="text-[13px] text-gray-600 mt-2 leading-relaxed">
          To oprocentowanie Twojego konta oszczędnościowego, na&nbsp;które
          co&nbsp;roku trafiają odsetki z&nbsp;obligacji COI (jeśli je
          wypłacisz). Dzięki temu porównujemy realny zysk.
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
          onClick={onCalc}
          className="flex-1 py-2.5 px-5 rounded-lg text-[15px] bg-green-700 text-white hover:bg-green-800 shadow-sm transition-all cursor-pointer"
        >
          Oblicz →
        </button>
      </div>
    </div>
  );
}
