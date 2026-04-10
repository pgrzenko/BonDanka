interface StepInflationProps {
  value: number;
  onChange: (v: number) => void;
  onBack: () => void;
  onNext: () => void;
}

export function StepInflation({
  value,
  onChange,
  onBack,
  onNext,
}: StepInflationProps) {
  // Display as percentage with 1 decimal
  const displayVal = (value * 100).toFixed(1).replace(".", ",");

  // Slider works in 0.1% increments: 1.0% to 15.0% → internal values 10..150
  const sliderVal = Math.round(value * 1000);

  function handleSliderChange(raw: number) {
    onChange(raw / 1000);
  }

  return (
    <div>
      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
        Krok 3 z 4
      </div>
      <h2 className="text-[22px] font-medium mb-6 leading-snug">
        Jakiej inflacji się spodziewasz?
      </h2>

      <div className="my-6">
        <div className="text-4xl font-medium text-gray-900 mb-3">
          {displayVal}{" "}
          <span className="text-lg font-normal text-gray-500">%</span>
        </div>
        <input
          type="range"
          min={10}
          max={150}
          step={1}
          value={sliderVal}
          onChange={(e) => handleSliderChange(Number(e.target.value))}
          className="w-full accent-gray-900"
        />
        <div className="text-[13px] text-gray-500 mt-2 leading-relaxed">
          Cel inflacyjny NBP to 2,5%. Nie wiesz? Zostaw domyślną wartość.
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
          onClick={onNext}
          className="flex-1 py-2.5 px-5 rounded-lg text-[15px] bg-gray-900 text-white hover:opacity-85 transition-all cursor-pointer"
        >
          Dalej →
        </button>
      </div>
    </div>
  );
}
