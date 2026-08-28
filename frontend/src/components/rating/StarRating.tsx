import React, { useState } from 'react';
import { Star, Award } from 'lucide-react';

interface StarRatingProps {
  score?: number;
  maxStars?: number;
  reviewCount?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isInteractive?: boolean;
  onChange?: (newScore: number) => void;
  showCount?: boolean;
  showScoreText?: boolean;
  showTopRatedBadge?: boolean;
  topRatedThreshold?: number; // default 4.5
  onClick?: () => void;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  score = 0,
  maxStars = 5,
  reviewCount,
  size = 'sm',
  isInteractive = false,
  onChange,
  showCount = true,
  showScoreText = true,
  showTopRatedBadge = false,
  topRatedThreshold = 4.5,
  onClick,
  className = '',
}) => {
  const [hoverScore, setHoverScore] = useState<number>(0);

  const activeScore = isInteractive ? (hoverScore || score) : score;
  const isTopRated = score >= topRatedThreshold && (reviewCount === undefined || reviewCount >= 5);

  const starSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-7 h-7',
  }[size];

  const textSizes = {
    xs: 'text-[10px]',
    sm: 'text-xs',
    md: 'text-sm font-semibold',
    lg: 'text-base font-bold',
    xl: 'text-xl font-bold',
  }[size];

  // Interactive Mode
  if (isInteractive) {
    const sentimentLabels: Record<number, string> = {
      5: '5.0 — Outstanding Experience',
      4: '4.0 — Good & Reliable',
      3: '3.0 — Average',
      2: '2.0 — Needs Improvement',
      1: '1.0 — Poor Experience',
    };

    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-paper-border shadow-2xs w-fit">
          {Array.from({ length: maxStars }).map((_, i) => {
            const starValue = i + 1;
            const filled = starValue <= activeScore;

            return (
              <button
                key={starValue}
                type="button"
                onMouseEnter={() => setHoverScore(starValue)}
                onMouseLeave={() => setHoverScore(0)}
                onClick={() => onChange && onChange(starValue)}
                className="p-1 focus:outline-none transition-transform hover:scale-120 active:scale-95"
                title={`${starValue} Star${starValue > 1 ? 's' : ''}`}
              >
                <Star
                  className={`${starSizes} transition-colors ${
                    filled
                      ? 'fill-amber-400 text-amber-500'
                      : 'text-ink-200 fill-transparent'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {activeScore > 0 && (
          <div className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 inline-block animate-in fade-in">
            {sentimentLabels[activeScore] || `${activeScore}.0 Stars`}
          </div>
        )}
      </div>
    );
  }

  // Read-only Mode
  const hasRatings = (reviewCount !== undefined ? reviewCount > 0 : true) && score > 0;
  const formattedScore = hasRatings ? score.toFixed(1) : 'New';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 ${
        onClick ? 'cursor-pointer hover:opacity-85' : ''
      } ${className}`}
      title={
        hasRatings
          ? `${formattedScore} out of 5 stars (${reviewCount || 0} verified engagement ratings)`
          : 'No engagement ratings yet'
      }
    >
      <div className="flex items-center gap-1 bg-amber-50/90 text-amber-900 border border-amber-200/90 px-2 py-0.5 rounded-md shadow-2xs">
        <Star className={`${starSizes} fill-amber-400 text-amber-500 shrink-0`} />
        {showScoreText && (
          <span className={`font-heading font-bold ${textSizes}`}>
            {formattedScore}
          </span>
        )}
      </div>

      {showCount && reviewCount !== undefined && (
        <span className="text-xs text-ink-500 font-medium">
          ({reviewCount})
        </span>
      )}

      {showTopRatedBadge && isTopRated && (
        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wide bg-gradient-to-r from-amber-100 to-amber-200 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded-md shadow-2xs">
          <Award className="w-3 h-3 text-amber-700" />
          <span>Top Rated</span>
        </span>
      )}
    </div>
  );
};
