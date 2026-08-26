import React from 'react';
import { Check } from 'lucide-react';

interface MultiSelectPillsProps<T extends string> {
  options: readonly T[] | T[];
  selected: T[];
  onChange: (selected: T[]) => void;
  label?: string;
  helperText?: string;
  error?: string;
  colorScheme?: 'amber' | 'teal';
}

export const MultiSelectPills = <T extends string>({
  options,
  selected,
  onChange,
  label,
  helperText,
  error,
  colorScheme = 'amber',
}: MultiSelectPillsProps<T>) => {
  const toggleOption = (option: T) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const isAmber = colorScheme === 'amber';

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-ink-800">
          {label}
        </label>
      )}

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);

          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleOption(option)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all border ${
                isSelected
                  ? isAmber
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm scale-[1.02]'
                    : 'bg-tealdeep-700 text-white border-tealdeep-800 shadow-sm scale-[1.02]'
                  : 'bg-[#FDFBF7] text-ink-700 border-paper-border hover:border-paper-300 hover:bg-white'
              }`}
            >
              <div
                className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                  isSelected
                    ? isAmber
                      ? 'bg-white/20 text-white'
                      : 'bg-white/20 text-white'
                    : 'border border-ink-300 bg-white'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-ink-500">{helperText}</p>
      )}
    </div>
  );
};
