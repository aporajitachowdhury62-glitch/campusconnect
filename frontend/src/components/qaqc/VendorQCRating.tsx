import React from 'react';
import { Star, MessageSquare } from 'lucide-react';

interface VendorQCRatingProps {
  score?: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  showLabel?: boolean;
  onClick?: () => void;
  className?: string;
}

export const VendorQCRating: React.FC<VendorQCRatingProps> = ({
  score = 0,
  reviewCount = 0,
  size = 'sm',
  showCount = true,
  showLabel = true,
  onClick,
  className = '',
}) => {
  const hasReviews = reviewCount > 0 && score > 0;
  const formattedScore = hasReviews ? score.toFixed(1) : 'New';

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base font-bold',
  }[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 ${
        onClick ? 'cursor-pointer hover:opacity-80' : ''
      } ${className}`}
      title={hasReviews ? `Quality Control Score: ${formattedScore} out of 5 (${reviewCount} verified student reviews)` : 'No reviews yet'}
    >
      <div className="flex items-center gap-1 bg-amber-50/90 text-amber-900 border border-amber-200/90 px-2 py-0.5 rounded-md">
        <Star className={`${starSizes} fill-amber-400 text-amber-500 shrink-0`} />
        <span className={`font-heading font-bold ${textSizes}`}>
          {formattedScore}
        </span>
        {hasReviews && <span className="text-[10px] text-amber-700/80 font-medium">/5</span>}
      </div>

      {showLabel && (
        <span className="text-[11px] font-semibold text-ink-500 hidden sm:inline">
          QC Score
        </span>
      )}

      {showCount && (
        <span className="text-xs text-ink-500 flex items-center gap-0.5">
          <span>({reviewCount})</span>
        </span>
      )}
    </div>
  );
};
