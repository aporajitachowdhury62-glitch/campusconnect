import React from 'react';
import { StarRating } from './StarRating';
import { RatingSummaryData, UserRoleType } from '../../types';
import { Award, Star, Tag } from 'lucide-react';

export interface RatingSummaryProps {
  summary: RatingSummaryData;
  userName?: string;
  role?: UserRoleType | string;
  className?: string;
}

export const RatingSummary: React.FC<RatingSummaryProps> = ({
  summary,
  userName,
  role,
  className = '',
}) => {
  const { avg_rating = 0, rating_count = 0, rating_breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }, top_tags = [] } = summary || {};
  const isTopRated = avg_rating >= 4.5 && rating_count >= 5;
  const isStudent = (role || '').toLowerCase().includes('student');

  return (
    <div
      className={`paper-card p-5 sm:p-6 bg-white border border-paper-border shadow-2xs space-y-5 ${className}`}
    >
      {/* Top Header: Score & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-paper-border">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center min-w-[90px] shadow-2xs">
            <span className="font-heading font-bold text-3xl sm:text-4xl text-amber-900 block leading-none">
              {rating_count > 0 ? avg_rating.toFixed(1) : 'New'}
            </span>
            <div className="flex justify-center mt-1.5">
              <StarRating
                rating={avg_rating}
                totalReviews={rating_count}
                size="sm"
                showCount={false}
                showScoreText={false}
              />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 block mt-1">
              {rating_count} {rating_count === 1 ? 'Rating' : 'Ratings'}
            </span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-heading font-bold text-lg text-ink-900">
                {userName ? `${userName}'s Trust & Reliability Score` : 'Trust & Reliability Score'}
              </h3>
              {isTopRated && (
                <span className="inline-flex items-center gap-1 text-xs font-bold bg-gradient-to-r from-amber-100 to-amber-200 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md shadow-2xs">
                  <Award className="w-3.5 h-3.5 text-amber-700" />
                  <span>{isStudent ? 'Top Talent (4.5+ ★)' : 'Top Rated Employer (4.5+ ★)'}</span>
                </span>
              )}
            </div>
            <p className="text-xs text-ink-500">
              100% verified ratings generated from completed neighborhood work engagements on CampusConnect.
            </p>
          </div>
        </div>
      </div>

      {/* Distribution Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
        {/* 5 to 1 Star Progress Bars */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-400 block mb-1">
            Rating Distribution
          </span>

          {[5, 4, 3, 2, 1].map((stars) => {
            const count = rating_breakdown[stars as keyof typeof rating_breakdown] || 0;
            const percentage = rating_count > 0 ? Math.round((count / rating_count) * 100) : 0;

            return (
              <div key={stars} className="flex items-center gap-2 text-xs text-ink-600">
                <span className="w-6 font-bold text-ink-700 flex items-center gap-0.5">
                  {stars} <Star className="w-3 h-3 fill-amber-400 text-amber-500 inline" />
                </span>

                <div className="flex-1 h-2 rounded-full bg-paper-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      stars >= 4 ? 'bg-emerald-500' : stars === 3 ? 'bg-amber-400' : 'bg-rose-400'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span className="w-12 text-right text-[11px] text-ink-400 font-medium">
                  {count} ({percentage}%)
                </span>
              </div>
            );
          })}
        </div>

        {/* Top Highlight Tags */}
        <div className="bg-paper-50 p-4 rounded-xl border border-paper-border space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-400 flex items-center gap-1.5">
            <Tag className="w-3 h-3 text-marigold-600" />
            <span>Top Endorsed Qualities</span>
          </span>

          {top_tags && top_tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {top_tags.map(({ tag, count }) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-ink-800 border border-paper-border shadow-2xs"
                >
                  <span>✓ {tag}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-paper-200 text-ink-600 font-bold">
                    {count}
                  </span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-ink-400 italic">
              Highlights and endorsement tags will appear as completed shifts are rated.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RatingSummary;
