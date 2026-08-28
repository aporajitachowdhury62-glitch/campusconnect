import React, { useState, useEffect } from 'react';
import { RatingSummary } from './RatingSummary';
import { RatingsList } from './RatingsList';
import { RatingModal } from './RatingModal';
import { PendingRatingsBanner } from './PendingRatingsBanner';
import {
  Rating,
  Engagement,
  RatingSummaryData,
  UserRoleType,
} from '../../types';
import { ratingService } from '../../services/ratingService';
import {
  Star,
  CheckCircle2,
  Briefcase,
  Sparkles,
  Award,
  RefreshCw,
  Plus,
  Clock,
  ThumbsUp,
  MessageSquare,
} from 'lucide-react';

interface MyRatingsViewProps {
  userId: string;
  userName: string;
  userRole: UserRoleType;
  onRefreshParent?: () => void;
}

export const MyRatingsView: React.FC<MyRatingsViewProps> = ({
  userId,
  userName,
  userRole,
  onRefreshParent,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'summary' | 'engagements' | 'received' | 'given'>('summary');
  const [summary, setSummary] = useState<RatingSummaryData | null>(null);
  const [receivedRatings, setReceivedRatings] = useState<Rating[]>([]);
  const [givenRatings, setGivenRatings] = useState<Rating[]>([]);
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [pendingEngagements, setPendingEngagements] = useState<Engagement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [ratingTargetEngagement, setRatingTargetEngagement] = useState<Engagement | null>(null);

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      const [sum, received, given, engs, pending] = await Promise.all([
        ratingService.fetchUserRatingSummary(userId),
        ratingService.fetchUserRatings(userId),
        ratingService.fetchGivenRatings(userId),
        ratingService.fetchUserEngagements(userId, userRole),
        ratingService.fetchPendingRatings(userId, userRole),
      ]);
      setSummary(sum);
      setReceivedRatings(received);
      setGivenRatings(given);
      setEngagements(engs);
      setPendingEngagements(pending);
    } catch (e) {
      console.error('Failed loading ratings view data', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [userId, userRole]);

  const handleMarkEngagementComplete = async (eng: Engagement) => {
    try {
      const completed = await ratingService.completeEngagement(eng.id);
      setEngagements((prev) =>
        prev.map((item) => (item.id === eng.id ? completed : item))
      );
      setPendingEngagements((prev) => [completed, ...prev]);
      // Open rating modal immediately
      setRatingTargetEngagement(completed);
      if (onRefreshParent) onRefreshParent();
    } catch (e) {
      console.error('Failed completing engagement', e);
    }
  };

  const handleRatingSubmitted = async () => {
    await loadAllData();
    if (onRefreshParent) onRefreshParent();
  };

  return (
    <div className="space-y-6">
      {/* Pending Ratings Reminder Banner */}
      <PendingRatingsBanner
        pendingEngagements={pendingEngagements}
        currentUserId={userId}
        currentUserRole={userRole}
        onRatingSubmitted={handleRatingSubmitted}
      />

      {/* Top Controls & Navigation */}
      <div className="bg-white p-5 rounded-2xl border border-paper-border shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-300 text-xs font-semibold mb-1">
              <Award className="w-3.5 h-3.5 text-amber-700" />
              <span>Two-Sided Marketplace Trust Hub</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-ink-900">
              {userName}'s Ratings & Work Engagements
            </h2>
            <p className="text-xs text-ink-500">
              Review your performance ratings, complete ongoing shifts, and rate work partners after engagements.
            </p>
          </div>

          <button
            type="button"
            onClick={loadAllData}
            className="btn-secondary text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5 self-start md:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Ratings</span>
          </button>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-paper-border">
          {[
            { id: 'summary', label: 'Trust Summary & Stats', count: summary?.rating_count },
            { id: 'engagements', label: 'Work Engagements', count: engagements.length },
            { id: 'received', label: 'Ratings Received', count: receivedRatings.length },
            { id: 'given', label: 'Ratings Given by Me', count: givenRatings.length },
          ].map((tab) => {
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`text-xs px-3.5 py-2 rounded-xl font-heading font-bold transition-all flex items-center gap-1.5 ${
                  active
                    ? 'bg-ink-900 text-white shadow-xs'
                    : 'bg-paper-100 text-ink-600 hover:bg-paper-200 border border-paper-border'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      active ? 'bg-white/20 text-white' : 'bg-paper-200 text-ink-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-tab 1: Summary */}
      {activeSubTab === 'summary' && summary && (
        <RatingSummary
          summary={summary}
          userName={userName}
          role={userRole}
        />
      )}

      {/* Sub-tab 2: Work Engagements */}
      {activeSubTab === 'engagements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-ink-800 uppercase tracking-wider">
              Active & Completed Gigs ({engagements.length})
            </h3>
          </div>

          <div className="space-y-3">
            {engagements.map((eng) => {
              const isOngoing = eng.status === 'ongoing';
              const hasRated =
                userRole === 'student'
                  ? eng.has_student_rated
                  : eng.has_shopkeeper_rated;
              const otherParty =
                userRole === 'student' ? eng.shop_name : eng.student_name;

              return (
                <div
                  key={eng.id}
                  className="paper-card p-5 bg-white border border-paper-border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading font-bold text-base text-ink-900">
                        {eng.job_title}
                      </h4>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border ${
                          isOngoing
                            ? 'bg-sky-50 text-sky-800 border-sky-300 animate-pulse'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        }`}
                      >
                        {isOngoing ? 'Active Ongoing Shift' : 'Completed Shift'}
                      </span>
                    </div>

                    <p className="text-xs text-ink-600">
                      Work Partner: <strong>{otherParty}</strong> • Category: {eng.category}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-ink-400 pt-1">
                      {eng.pay_rate && <span>Rate: <strong>{eng.pay_rate}</strong></span>}
                      {eng.shifts_completed && (
                        <span>• Shifts Completed: <strong>{eng.shifts_completed}</strong></span>
                      )}
                      <span>
                        • Started {new Date(eng.started_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    {isOngoing ? (
                      <button
                        type="button"
                        onClick={() => handleMarkEngagementComplete(eng)}
                        className="btn-teal text-xs py-2 px-4 rounded-xl font-semibold flex items-center gap-1.5 shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark as Complete & Rate</span>
                      </button>
                    ) : !hasRated ? (
                      <button
                        type="button"
                        onClick={() => setRatingTargetEngagement(eng)}
                        className="btn-primary text-xs py-2 px-4 rounded-xl font-semibold flex items-center gap-1.5 shadow-xs"
                      >
                        <Star className="w-3.5 h-3.5 fill-white text-white" />
                        <span>Rate Partner</span>
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Rating Submitted ✓</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-tab 3: Ratings Received */}
      {activeSubTab === 'received' && (
        <RatingsList
          ratings={receivedRatings}
          isLoading={isLoading}
          emptyTitle="No Ratings Received Yet"
          emptySubtitle="Once employers or students rate completed shifts with you, their verified reviews will appear here."
        />
      )}

      {/* Sub-tab 4: Ratings Given by Me */}
      {activeSubTab === 'given' && (
        <RatingsList
          ratings={givenRatings}
          isLoading={isLoading}
          emptyTitle="No Ratings Given Yet"
          emptySubtitle="You have not submitted reviews for any completed work partners yet."
          showRaterRole={false}
        />
      )}

      {/* Rating Trigger Modal */}
      {ratingTargetEngagement && (
        <RatingModal
          isOpen={Boolean(ratingTargetEngagement)}
          onClose={() => setRatingTargetEngagement(null)}
          engagement={ratingTargetEngagement}
          currentUserId={userId}
          currentUserRole={userRole}
          onRatingSubmitted={() => {
            handleRatingSubmitted();
            setRatingTargetEngagement(null);
          }}
        />
      )}
    </div>
  );
};
