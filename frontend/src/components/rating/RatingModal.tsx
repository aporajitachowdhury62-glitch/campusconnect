import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { StarRating } from './StarRating';
import { Engagement, Rating, UserRoleType } from '../../types';
import { ratingService } from '../../services/ratingService';
import {
  Sparkles,
  CheckCircle2,
  X,
  User,
  Store,
  GraduationCap,
  MessageSquare,
} from 'lucide-react';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  engagement: Engagement;
  currentUserId: string;
  currentUserRole: UserRoleType;
  onRatingSubmitted: (rating: Rating, updatedEngagement: Engagement) => void;
}

const STUDENT_RATING_TAGS = [
  'Punctual & On Time',
  'Quick Learner',
  'Polite to Customers',
  'Hardworking',
  'Reliable',
  'Followed Instructions',
  'Tech Savvy',
  'Great Team Player',
];

const SHOPKEEPER_RATING_TAGS = [
  'Paid on Time',
  'Respectful & Friendly',
  'Clear Instructions',
  'Safe Work Environment',
  'Accurate Hours',
  'Free Snacks / Meals',
  'Flexible Shifts',
  'Great Communication',
];

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  engagement,
  currentUserId,
  currentUserRole,
  onRatingSubmitted,
}) => {
  const [score, setScore] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isStudentRatingShopkeeper = currentUserRole === 'student';
  const targetName = isStudentRatingShopkeeper
    ? engagement.shopkeeper_name
    : engagement.student_name;
  const targetRoleName = isStudentRatingShopkeeper
    ? `Shopkeeper / ${engagement.shop_name}`
    : `Student (${engagement.student_college || 'Campus Talent'})`;

  const availableTags = isStudentRatingShopkeeper
    ? SHOPKEEPER_RATING_TAGS
    : STUDENT_RATING_TAGS;

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (score < 1 || score > 5) {
      setError('Please select a star rating from 1 to 5.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const raterName = isStudentRatingShopkeeper
        ? engagement.student_name
        : engagement.shopkeeper_name;
      const rateeId = isStudentRatingShopkeeper
        ? engagement.shopkeeper_id
        : engagement.student_id;
      const rateeName = isStudentRatingShopkeeper
        ? engagement.shopkeeper_name
        : engagement.student_name;
      const rateeRole: UserRoleType = isStudentRatingShopkeeper
        ? 'shopkeeper'
        : 'student';

      const result = await ratingService.submitRating(engagement.id, {
        engagement_id: engagement.id,
        job_title: engagement.job_title,
        rater_id: currentUserId,
        rater_name: raterName,
        rater_role: currentUserRole,
        ratee_id: rateeId,
        ratee_name: rateeName,
        ratee_role: rateeRole,
        score,
        comment: comment.trim() || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
      });

      onRatingSubmitted(result.rating, result.engagement);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Rate Work Engagement"
      subtitle={`Completed Job: ${engagement.job_title} • ${engagement.shop_name}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        {/* Ratee Info Banner */}
        <div className="p-3.5 bg-paper-50 rounded-xl border border-paper-border flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
              isStudentRatingShopkeeper
                ? 'bg-tealdeep-50 text-tealdeep-800 border border-tealdeep-200'
                : 'bg-marigold-50 text-marigold-900 border border-marigold-200'
            }`}
          >
            {isStudentRatingShopkeeper ? (
              <Store className="w-5 h-5" />
            ) : (
              <GraduationCap className="w-5 h-5" />
            )}
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-ink-400 block tracking-wider">
              {isStudentRatingShopkeeper ? 'Rating Employer:' : 'Rating Student Worker:'}
            </span>
            <h4 className="font-heading font-bold text-sm sm:text-base text-ink-900">
              {targetName}
            </h4>
            <p className="text-xs text-ink-500">{targetRoleName}</p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Interactive Star Picker */}
        <div>
          <label className="block text-xs font-bold text-ink-700 uppercase tracking-wider mb-2">
            Overall Experience Rating (1 to 5 Stars) *
          </label>
          <StarRating
            score={score}
            isInteractive={true}
            size="lg"
            onChange={(newScore) => setScore(newScore)}
          />
        </div>

        {/* Quick Tag Badges */}
        <div>
          <label className="block text-xs font-bold text-ink-700 uppercase tracking-wider mb-1.5">
            Key Highlights & Tags (Click to select)
          </label>
          <div className="flex flex-wrap gap-1.5">
            {availableTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-marigold-100 text-marigold-900 border-marigold-400 font-semibold shadow-2xs'
                      : 'bg-white text-ink-600 border-paper-border hover:bg-paper-100'
                  }`}
                >
                  {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Comment Box */}
        <div>
          <label className="block text-xs font-bold text-ink-700 uppercase tracking-wider mb-1">
            Written Review / Feedback (Optional)
          </label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={
              isStudentRatingShopkeeper
                ? 'How was the shift environment, payment promptness, and communication?'
                : 'How was the student punctuality, work quality, and attitude?'
            }
            className="w-full paper-input text-xs leading-relaxed"
          />
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-paper-border">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary text-xs py-2 px-4 rounded-xl"
            disabled={isSubmitting}
          >
            Skip for now
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary text-xs py-2.5 px-5 rounded-xl font-semibold flex items-center gap-2 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Submitting Rating...' : 'Submit Verified Rating'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
