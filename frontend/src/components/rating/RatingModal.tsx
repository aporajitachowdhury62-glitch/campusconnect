import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { StarRating } from './StarRating';
import { Engagement, Rating, UserRoleType } from '../../types';
import { ratingService } from '../../services/ratingService';
import {
  Sparkles,
  Store,
  GraduationCap,
} from 'lucide-react';

export interface RatingModalProps {
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
  'Free Snacks / Meals',
  'Flexible Schedule',
  'Accurate Hours',
  'Great Mentorship',
];

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  engagement,
  currentUserId,
  currentUserRole,
  onRatingSubmitted,
}) => {
  const isCurrentStudent = (currentUserRole || '').toLowerCase().includes('student');

  // If active user is student, they rate the shopkeeper. If shopkeeper, they rate the student.
  const rateeName = isCurrentStudent ? engagement.shopkeeper_name : engagement.student_name;
  const rateeRole: UserRoleType = isCurrentStudent ? 'shopkeeper' : 'student';
  const rateeId = isCurrentStudent ? engagement.shopkeeper_id : engagement.student_id;
  const availableTags = isCurrentStudent ? SHOPKEEPER_RATING_TAGS : STUDENT_RATING_TAGS;

  const [score, setScore] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
    } else {
      if (selectedTags.length >= 4) return;
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (score < 1 || score > 5) {
      setErrorMsg('Please select a star rating from 1 to 5');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);

      const ratingPayload = {
        engagement_id: engagement.id,
        job_title: engagement.job_title,
        rater_id: currentUserId,
        rater_name: isCurrentStudent ? engagement.student_name : engagement.shopkeeper_name,
        rater_role: currentUserRole,
        ratee_id: rateeId,
        ratee_name: rateeName,
        ratee_role: rateeRole,
        score,
        comment: comment.trim() || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
      };

      const result = await ratingService.submitRating(engagement.id, ratingPayload);
      onRatingSubmitted(result.rating, result.engagement);
      onClose();
    } catch (e) {
      console.error(e);
      setErrorMsg('Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Rate your experience with ${rateeName}`}
      subtitle={`Completed Engagement: ${engagement.job_title} • Verified 2-Sided Review`}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Engagement Summary Pill */}
        <div className="p-3.5 rounded-xl bg-paper-100 border border-paper-border flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                isCurrentStudent
                  ? 'bg-tealdeep-50 text-tealdeep-800 border border-tealdeep-200'
                  : 'bg-marigold-50 text-marigold-900 border border-marigold-200'
              }`}
            >
              {isCurrentStudent ? (
                <Store className="w-3.5 h-3.5" />
              ) : (
                <GraduationCap className="w-3.5 h-3.5" />
              )}
            </div>
            <div>
              <span className="font-heading font-bold text-ink-900 block">
                {engagement.job_title}
              </span>
              <span className="text-ink-500 text-[11px]">
                {engagement.shop_name} • {engagement.category}
              </span>
            </div>
          </div>

          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[10px] uppercase tracking-wider">
            Shift Completed
          </span>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
            {errorMsg}
          </div>
        )}

        {/* Star Rating Interactive Selector */}
        <div className="space-y-1.5 text-center sm:text-left">
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-700">
            Overall Rating (1 to 5 Stars)*
          </label>
          <div className="flex justify-center sm:justify-start">
            <StarRating
              rating={score}
              isInteractive={true}
              onChange={(newVal) => setScore(newVal)}
              size="lg"
            />
          </div>
        </div>

        {/* Endorsement Tags */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold uppercase tracking-wider text-ink-700">
              Endorse Top Strengths (Pick up to 4)
            </label>
            <span className="text-[11px] text-ink-400">
              {selectedTags.length}/4 selected
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {availableTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                    isSelected
                      ? 'bg-marigold-500 text-white border-marigold-600 shadow-2xs scale-102 font-semibold'
                      : 'bg-paper-50 text-ink-700 border-paper-border hover:bg-paper-200'
                  }`}
                >
                  <span>{isSelected ? '✓ ' : '+ '}</span>
                  <span>{tag}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Written Feedback */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-700">
            Share Details & Written Feedback (Optional)
          </label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={`How was working with ${rateeName}? Mention punctuality, payment clarity, or work atmosphere...`}
            className="input-field text-xs resize-none"
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

export default RatingModal;
