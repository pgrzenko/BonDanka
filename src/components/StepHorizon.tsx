interface StepHorizonProps {
  value: number;
  onChange: (v: number) => void;
  onNext: () => void;
}

function pluralLat(n: number): string {
  if (n === 1) return "rok";
  if (n >= 2 && n <= 4) return "lata";
  return "lat";
}

export function StepHorizon({ value, onChange, onNext }: StepHorizonProps) {
  return (
    <div>
      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
        Krok 1 z 4
      </div>
      <h2 className="text-[22px] font-medium mb-6 leading-snug">
        Za ile lat będziesz potrzebować tych pieniędzy?
      </h2>

      <div className="my-6">
        <div className="text-4xl font-medium text-gray-900 mb-3">
          {value}{" "}
          <span className="text-lg font-normal text-gray-500">
            {pluralLat(value)}
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={15}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-gray-900"
        />
        <div className="text-[13px] text-gray-500 mt-2 leading-relaxed">
          Przesuń suwak, aby wybrać horyzont od 1 do 15 lat.
        </div>
      </div>

      <div className="flex gap-3 mt-8">
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
