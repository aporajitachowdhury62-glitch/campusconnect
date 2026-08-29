import React, { useState } from 'react';
import { Rating } from '../../types';
import { StarRating } from './StarRating';
import { RoleBadge } from '../common/RoleBadge';
import {
  GraduationCap,
  Store,
  Star,
} from 'lucide-react';

export interface RatingsListProps {
  ratings?: Rating[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptySubtitle?: string;
  showRaterRole?: boolean;
}

export const RatingsList: React.FC<RatingsListProps> = ({
  ratings = [],
  isLoading = false,
  emptyTitle = 'No Ratings Yet',
  emptySubtitle = 'Verified reviews will appear here once work engagements are completed and rated.',
  showRaterRole = true,
}) => {
  const [selectedScoreFilter, setSelectedScoreFilter] = useState<number | 'all'>('all');

  const filteredRatings = ratings.filter((r) => {
    if (selectedScoreFilter !== 'all') {
      return Math.round(r.score) === selectedScoreFilter;
    }
    return true;
  });

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return 'Recently';
    }
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center space-y-2">
        <div className="w-8 h-8 border-3 border-marigold-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-ink-500">Loading verified reviews...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header & Star Filter Chips */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-paper-border">
        <span className="text-xs font-bold text-ink-700 uppercase tracking-wider">
          Verified Reviews ({ratings.length})
        </span>

        {ratings.length > 0 && (
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setSelectedScoreFilter('all')}
              className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all ${
                selectedScoreFilter === 'all'
                  ? 'bg-ink-900 text-white'
                  : 'bg-paper-100 text-ink-600 hover:bg-paper-200 border border-paper-border'
              }`}
            >
              All ({ratings.length})
            </button>

            {[5, 4, 3, 2, 1].map((stars) => {
              const count = ratings.filter((r) => Math.round(r.score) === stars).length;
              if (count === 0) return null;
              return (
                <button
                  key={stars}
                  type="button"
                  onClick={() => setSelectedScoreFilter(stars)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
                    selectedScoreFilter === stars
                      ? 'bg-ink-900 text-white'
                      : 'bg-paper-100 text-ink-600 hover:bg-paper-200 border border-paper-border'
                  }`}
                >
                  <span>{stars}★</span>
                  <span className="text-[10px] opacity-75">({count})</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Ratings Feed */}
      {filteredRatings.length === 0 ? (
        <div className="p-8 text-center bg-paper-50 rounded-2xl border border-paper-border space-y-2">
          <div className="w-10 h-10 rounded-full bg-paper-200 text-ink-400 flex items-center justify-center mx-auto">
            <Star className="w-5 h-5" />
          </div>
          <h4 className="font-heading font-bold text-sm text-ink-800">
            {emptyTitle}
          </h4>
          <p className="text-xs text-ink-500 max-w-sm mx-auto">{emptySubtitle}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRatings.map((rating) => {
            const isRaterStudent = (rating.rater_role || '').toLowerCase().includes('student');

            return (
              <div
                key={rating.id}
                className="p-4 bg-white rounded-xl border border-paper-border shadow-2xs space-y-2.5"
              >
                {/* Top Row: Rater Info & Stars */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isRaterStudent
                          ? 'bg-marigold-50 text-marigold-900 border border-marigold-200'
                          : 'bg-tealdeep-50 text-tealdeep-800 border border-tealdeep-200'
                      }`}
                    >
                      {isRaterStudent ? (
                        <GraduationCap className="w-4 h-4" />
                      ) : (
                        <Store className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-heading font-bold text-xs sm:text-sm text-ink-900">
                          {rating.rater_name}
                        </span>
                        {showRaterRole && (
                          <RoleBadge role={rating.rater_role} size="xs" />
                        )}
                      </div>

                      <p className="text-[11px] text-ink-500">
                        Engagement: <strong>{rating.job_title}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <StarRating
                      rating={rating.score}
                      size="sm"
                      showCount={false}
                      showScoreText={true}
                    />
                    <span className="text-[10px] text-ink-400 block mt-0.5">
                      {formatDate(rating.created_at)}
                    </span>
                  </div>
                </div>

                {/* Comment */}
                {rating.comment && (
                  <p className="text-xs text-ink-700 leading-relaxed italic bg-paper-50/50 p-2.5 rounded-lg border border-paper-border/60">
                    "{rating.comment}"
                  </p>
                )}

                {/* Tags */}
                {rating.tags && rating.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {rating.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-paper-100 text-ink-700 border border-paper-border"
                      >
                        ✓ {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RatingsList;
