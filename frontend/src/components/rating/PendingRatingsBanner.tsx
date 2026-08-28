import React, { useState } from 'react';
import { Engagement, UserRoleType, Rating } from '../../types';
import { RatingModal } from './RatingModal';
import { Sparkles, Star, Award, CheckCircle2, ChevronRight } from 'lucide-react';

interface PendingRatingsBannerProps {
  pendingEngagements: Engagement[];
  currentUserId: string;
  currentUserRole: UserRoleType;
  onRatingSubmitted: (rating: Rating, updatedEngagement: Engagement) => void;
}

export const PendingRatingsBanner: React.FC<PendingRatingsBannerProps> = ({
  pendingEngagements,
  currentUserId,
  currentUserRole,
  onRatingSubmitted,
}) => {
  const [activeRatingEngagement, setActiveRatingEngagement] = useState<Engagement | null>(null);

  if (pendingEngagements.length === 0) return null;

  return (
    <>
      <div className="p-4 bg-gradient-to-r from-marigold-50 via-amber-50 to-tealdeep-50/50 rounded-2xl border border-marigold-300 shadow-warm-sm space-y-3 mb-6 animate-in fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-marigold-100 text-marigold-800 border border-marigold-300 flex items-center justify-center font-bold shrink-0 shadow-2xs">
              <Star className="w-5 h-5 fill-marigold-500 text-marigold-600" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-marigold-200 text-marigold-900">
                  Rating Due
                </span>
                <h4 className="font-heading font-bold text-sm sm:text-base text-ink-900">
                  {pendingEngagements.length} Completed Gig{pendingEngagements.length > 1 ? 's' : ''} Awaiting Your Rating
                </h4>
              </div>
              <p className="text-xs text-ink-600 mt-0.5">
                Share your experience to help maintain trust in our campus work community.
              </p>
            </div>
          </div>
        </div>

        {/* List of pending items */}
        <div className="space-y-2 pt-1">
          {pendingEngagements.map((eng) => {
            const isStudent = currentUserRole === 'student';
            const otherParty = isStudent ? eng.shop_name : eng.student_name;

            return (
              <div
                key={eng.id}
                className="p-3 bg-white/90 rounded-xl border border-paper-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs"
              >
                <div>
                  <h5 className="font-heading font-bold text-xs sm:text-sm text-ink-900">
                    {eng.job_title}
                  </h5>
                  <p className="text-xs text-ink-500">
                    With <strong>{otherParty}</strong> • Completed {eng.completed_at ? new Date(eng.completed_at).toLocaleDateString() : 'recently'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveRatingEngagement(eng)}
                  className="btn-primary text-xs py-2 px-4 rounded-xl font-semibold flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
                >
                  <Star className="w-3.5 h-3.5 fill-white text-white" />
                  <span>Rate Now</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {activeRatingEngagement && (
        <RatingModal
          isOpen={Boolean(activeRatingEngagement)}
          onClose={() => setActiveRatingEngagement(null)}
          engagement={activeRatingEngagement}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
          onRatingSubmitted={(rating, updated) => {
            onRatingSubmitted(rating, updated);
            setActiveRatingEngagement(null);
          }}
        />
      )}
    </>
  );
};
