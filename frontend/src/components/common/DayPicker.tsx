import React from 'react';
import { DayOfWeek } from '../../types';
import { DAYS_OF_WEEK } from '../../data/mockData';
import { Calendar } from 'lucide-react';

interface DayPickerProps {
  selectedDays: DayOfWeek[];
  onChange: (days: DayOfWeek[]) => void;
  label?: string;
  helperText?: string;
  error?: string;
}

export const DayPicker: React.FC<DayPickerProps> = ({
  selectedDays,
  onChange,
  label = 'Days Available',
  helperText,
  error,
}) => {
  const toggleDay = (day: DayOfWeek) => {
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter((d) => d !== day));
    } else {
      // Keep in chronological Mon-Sun order
      const newDays = [...selectedDays, day];
      const ordered = DAYS_OF_WEEK.filter((d) => newDays.includes(d));
      onChange(ordered);
    }
  };

  const selectPreset = (type: 'weekdays' | 'weekends' | 'all' | 'clear') => {
    switch (type) {
      case 'weekdays':
        onChange(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
        break;
      case 'weekends':
        onChange(['Sat', 'Sun']);
        break;
      case 'all':
        onChange([...DAYS_OF_WEEK]);
        break;
      case 'clear':
        onChange([]);
        break;
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        {label && (
          <label className="block text-sm font-semibold text-ink-800 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-marigold-600" />
            <span>{label}</span>
          </label>
        )}
        
        {/* Preset quick actions */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-ink-400 text-[11px] hidden sm:inline">Presets:</span>
          <button
            type="button"
            onClick={() => selectPreset('weekdays')}
            className="px-2 py-0.5 rounded bg-paper-200 hover:bg-paper-300 text-ink-700 text-xs transition-colors"
          >
            Weekdays
          </button>
          <button
            type="button"
            onClick={() => selectPreset('weekends')}
            className="px-2 py-0.5 rounded bg-paper-200 hover:bg-paper-300 text-ink-700 text-xs transition-colors"
          >
            Weekends
          </button>
          <button
            type="button"
            onClick={() => selectPreset('all')}
            className="px-2 py-0.5 rounded bg-paper-200 hover:bg-paper-300 text-ink-700 text-xs transition-colors"
          >
            All
          </button>
          {selectedDays.length > 0 && (
            <button
              type="button"
              onClick={() => selectPreset('clear')}
              className="px-2 py-0.5 rounded text-ink-400 hover:text-ink-700 text-xs underline transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* 7 Day Buttons Grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {DAYS_OF_WEEK.map((day) => {
          const isSelected = selectedDays.includes(day);
          const isWeekend = day === 'Sat' || day === 'Sun';

          return (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`py-2.5 px-1 rounded-xl text-xs sm:text-sm font-semibold transition-all flex flex-col items-center justify-center gap-0.5 border ${
                isSelected
                  ? 'bg-gradient-to-b from-marigold-500 to-marigold-600 text-white border-marigold-600 shadow-sm scale-[1.02]'
                  : 'bg-[#FDFBF7] text-ink-700 border-paper-border hover:border-marigold-400 hover:bg-white'
              }`}
            >
              <span>{day}</span>
              <span
                className={`text-[9px] uppercase tracking-wider ${
                  isSelected
                    ? 'text-marigold-100 font-medium'
                    : isWeekend
                    ? 'text-amber-700/80 font-medium'
                    : 'text-ink-400'
                }`}
              >
                {isWeekend ? 'Wknd' : 'Wkdy'}
              </span>
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
