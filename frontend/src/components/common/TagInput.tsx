import React, { useState, KeyboardEvent } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  suggestedTags?: string[];
  label?: string;
  helperText?: string;
  error?: string;
  maxTags?: number;
}

export const TagInput: React.FC<TagInputProps> = ({
  tags,
  onChange,
  placeholder = 'Type skill & press Enter (e.g. POS Billing)...',
  suggestedTags = [],
  label,
  helperText,
  error,
  maxTags = 10,
}) => {
  const [inputValue, setInputValue] = useState('');

  const addTag = (tagToAdd: string) => {
    const trimmed = tagToAdd.trim();
    if (!trimmed) return;
    
    // Check duplicate case-insensitively
    const exists = tags.some((t) => t.toLowerCase() === trimmed.toLowerCase());
    if (!exists && tags.length < maxTags) {
      onChange([...tags, trimmed]);
    }
    setInputValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, idx) => idx !== indexToRemove));
  };

  const availableSuggestions = suggestedTags.filter(
    (st) => !tags.some((t) => t.toLowerCase() === st.toLowerCase())
  );

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-sm font-semibold text-ink-800">
            {label}
          </label>
          <span className="text-xs text-ink-500 font-medium">
            {tags.length}/{maxTags} tags
          </span>
        </div>
      )}

      {/* Input & Active Tags Box */}
      <div
        className={`min-h-[3rem] p-2 bg-[#FDFBF7] border rounded-xl flex flex-wrap items-center gap-1.5 transition-all focus-within:ring-2 focus-within:ring-marigold-500/20 focus-within:border-marigold-500 focus-within:bg-white ${
          error ? 'border-red-400 bg-red-50/30' : 'border-paper-border'
        }`}
      >
        {tags.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200/80 shadow-2xs group animate-in fade-in zoom-in-95 duration-150"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="text-amber-700/60 hover:text-amber-900 rounded-full hover:bg-amber-100 p-0.5 transition-colors focus:outline-none"
              aria-label={`Remove tag ${tag}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => inputValue && addTag(inputValue)}
          placeholder={tags.length === 0 ? placeholder : 'Add another...'}
          className="flex-1 min-w-[140px] bg-transparent border-none text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none px-1 py-1"
          disabled={tags.length >= maxTags}
        />
      </div>

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-ink-500">{helperText}</p>
      )}

      {/* Suggestion Chips */}
      {availableSuggestions.length > 0 && tags.length < maxTags && (
        <div className="pt-1">
          <div className="flex items-center gap-1.5 text-xs text-ink-500 mb-1.5">
            <Sparkles className="w-3 h-3 text-marigold-600" />
            <span>Popular quick-picks (click to add):</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {availableSuggestions.slice(0, 6).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addTag(suggestion)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-paper-200/80 hover:bg-marigold-100 text-ink-700 hover:text-marigold-900 border border-paper-border hover:border-marigold-300 transition-colors"
              >
                <Plus className="w-3 h-3 text-ink-400 group-hover:text-marigold-700" />
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
