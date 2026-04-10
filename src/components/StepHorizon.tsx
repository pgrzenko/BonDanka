import { useState } from "react";

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

type Preset = "short" | "medium" | "long";

function presetForValue(v: number): Preset | null {
  if (v >= 1 && v <= 5) return "short";
  if (v >= 6 && v <= 10) return "medium";
  if (v > 10) return "long";
  return null;
}

export function StepHorizon({ value, onChange, onNext }: StepHorizonProps) {
  const [editingText, setEditingText] = useState<string | null>(null);
  const activePreset = presetForValue(value);

  function applyPreset(preset: Preset) {
    if (preset === "short") onChange(4);
    else if (preset === "medium") onChange(8);
    else onChange(12);
  }

  function handleInputBlur() {
    if (editingText === null) return;
    const parsed = parseInt(editingText, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 15) {
      onChange(parsed);
    }
    setEditingText(null);
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    }
  }

  const presetBtn = (preset: Preset, label: string, sublabel: string) => (
    <button
      onClick={() => applyPreset(preset)}
      className={`flex-1 py-3 px-2 rounded-lg border text-center transition-all cursor-pointer ${
        activePreset === preset
          ? "border-gray-900 bg-gray-900 text-white"
          : "border-gray-300 bg-white text-gray-700 hover:border-gray-500"
      }`}
    >
      <div className="text-[14px] font-medium">{label}</div>
      <div
        className={`text-[12px] mt-0.5 ${
          activePreset === preset ? "text-gray-300" : "text-gray-400"
        }`}
      >
        {sublabel}
      </div>
    </button>
  );

  return (
    <div>
      {/* Hero header */}
      <div className="mb-6">
        <h1 className="text-[26px] font-semibold text-gray-900 leading-tight">
          BonDanka
        </h1>
        <p className="text-[15px] text-gray-500 mt-1.5 leading-relaxed">
          Sprawdź, które obligacje lepiej ochronią Twoje pieniądze przed
          inflacją — 4-letnie COI czy 10-letnie EDO.
        </p>
      </div>

      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
        Krok 1 z 4
      </div>
      <h2 className="text-[22px] font-medium mb-6 leading-snug">
        Na ile lat chcesz zainwestować pieniądze?
      </h2>

      {/* Presets */}
      <div className="flex gap-2.5 mb-6">
        {presetBtn("short", "Do 5 lat", "krótki termin")}
        {presetBtn("medium", "6–10 lat", "średni termin")}
        {presetBtn("long", "Ponad 10 lat", "długi termin")}
      </div>

      {/* Editable value + slider */}
      <div className="my-4">
        <div className="flex items-baseline gap-2 mb-3">
          <input
            type="text"
            inputMode="numeric"
            value={editingText !== null ? editingText : value}
            onChange={(e) => setEditingText(e.target.value.replace(/\D/g, ""))}
            onFocus={() => setEditingText(String(value))}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            className="w-16 text-4xl font-medium text-gray-900 bg-transparent border-b-2 border-gray-300 focus:border-gray-900 outline-none text-center transition-colors"
            aria-label="Liczba lat"
          />
          <span className="text-lg font-normal text-gray-500">
            {pluralLat(editingText !== null ? parseInt(editingText, 10) || value : value)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-gray-400 whitespace-nowrap">1 rok</span>
          <input
            type="range"
            min={1}
            max={15}
            step={1}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full accent-gray-900"
          />
          <span className="text-[13px] text-gray-400 whitespace-nowrap">15 lat</span>
        </div>
      </div>

      {/* Helper text */}
      <div className="text-[13px] text-gray-500 mt-4 leading-relaxed bg-gray-50 rounded-lg p-3">
        💡 Im dłuższy okres inwestycji, tym większa różnica między obligacjami
        COI a EDO. Sprawdź, co lepiej pasuje do Twoich planów.
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
