import React, { useState } from 'react';
import { Star, Upload, Image as ImageIcon, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { Review } from '../../types';

interface ReviewFormProps {
  vendorId: string;
  vendorName: string;
  defaultUserName?: string;
  defaultUserCollege?: string;
  onReviewSubmitted: (reviewData: Omit<Review, 'id' | 'created_at' | 'flagged'>) => Promise<void>;
  onCancel?: () => void;
}

const POPULAR_TAGS = [
  'Spotless Kitchen',
  'Hygiene Verified',
  'Friendly Owners',
  'Prompt Payout',
  'Free Meal Provided',
  'Safe Workplace',
  'Flexible Shifts',
  'Respectful Team',
];

export const ReviewForm: React.FC<ReviewFormProps> = ({
  vendorId,
  vendorName,
  defaultUserName = 'Aarav Sharma',
  defaultUserCollege = 'RV College of Engineering',
  onReviewSubmitted,
  onCancel,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [userName, setUserName] = useState<string>(defaultUserName);
  const [userCollege, setUserCollege] = useState<string>(defaultUserCollege);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Spotless Kitchen']);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please write a brief comment describing your experience.');
      return;
    }
    if (rating < 1 || rating > 5) {
      setError('Please select a star rating between 1 and 5.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await onReviewSubmitted({
        vendor_id: vendorId,
        user_id: 'current-student',
        user_name: userName.trim() || 'Verified Student',
        user_college: userCollege.trim() || 'Campus Student',
        rating,
        comment: comment.trim(),
        tags: selectedTags,
        photo_url: photoPreview || photoUrl || undefined,
      });

      setSubmittedSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedSuccess) {
    return (
      <div className="p-6 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-center space-y-3 animate-in fade-in">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="font-heading font-bold text-ink-900 text-lg">
          Thank you for your Quality Review!
        </h4>
        <p className="text-xs text-ink-600 max-w-md mx-auto">
          Your feedback helps fellow students know that <strong>{vendorName}</strong> maintains high hygiene and honest workplace standards.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-paper-50 p-5 rounded-2xl border border-paper-border">
      <div className="flex items-center justify-between pb-3 border-b border-paper-border">
        <div>
          <h4 className="font-heading font-bold text-base text-ink-900">
            Leave a Food Vendor Quality Review (QC)
          </h4>
          <p className="text-xs text-ink-500">
            Rate workplace hygiene, kitchen standards, and employer transparency at {vendorName}
          </p>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-1 rounded-lg text-ink-400 hover:text-ink-700 hover:bg-paper-200"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Star Rating Picker */}
      <div>
        <label className="block text-xs font-bold text-ink-700 uppercase tracking-wider mb-1.5">
          Overall Quality Score (1 to 5 Stars) *
        </label>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white p-2 rounded-xl border border-paper-border shadow-2xs">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1 focus:outline-none transition-transform hover:scale-115"
                title={`${star} Star${star > 1 ? 's' : ''}`}
              >
                <Star
                  className={`w-6 h-6 transition-colors ${
                    (hoverRating || rating) >= star
                      ? 'fill-amber-400 text-amber-500'
                      : 'text-ink-200 fill-transparent'
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
            {rating === 5 && '5.0 — Outstanding Hygiene & Culture'}
            {rating === 4 && '4.0 — Good & Clean Environment'}
            {rating === 3 && '3.0 — Average Standards'}
            {rating === 2 && '2.0 — Needs Hygiene Improvements'}
            {rating === 1 && '1.0 — Poor Conditions'}
          </span>
        </div>
      </div>

      {/* Student Identity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-ink-700 mb-1">
            Your Name / Nickname
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="e.g. Aarav Sharma"
            className="w-full paper-input text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink-700 mb-1">
            Your College / Institution
          </label>
          <input
            type="text"
            value={userCollege}
            onChange={(e) => setUserCollege(e.target.value)}
            placeholder="e.g. RV College of Engineering"
            className="w-full paper-input text-xs"
          />
        </div>
      </div>

      {/* Quick Tag Pills */}
      <div>
        <label className="block text-xs font-semibold text-ink-700 mb-1.5">
          Highlights & Badges (Click to select)
        </label>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_TAGS.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-marigold-100 text-marigold-900 border-marigold-300 font-semibold shadow-2xs'
                    : 'bg-white text-ink-600 border-paper-border hover:bg-paper-100'
                }`}
              >
                {isSelected ? `✓ ${tag}` : `+ ${tag}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed Comment */}
      <div>
        <label className="block text-xs font-semibold text-ink-700 mb-1">
          Detailed Review & Hygiene Feedback *
        </label>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience regarding food preparation cleanliness, shift fairness, kitchen safety, and owner behavior..."
          className="w-full paper-input text-xs leading-relaxed"
          required
        />
      </div>

      {/* Photo Upload Simulator */}
      <div>
        <label className="block text-xs font-semibold text-ink-700 mb-1">
          Photo Evidence (Optional — kitchen setup, storefront, hygiene badge)
        </label>
        <div className="flex items-center gap-3">
          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-paper-border text-ink-700 text-xs font-semibold hover:bg-paper-100 transition-colors shadow-2xs">
            <Upload className="w-3.5 h-3.5 text-marigold-600" />
            <span>{photoPreview ? 'Change Photo' : 'Upload Kitchen / Store Photo'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>

          {photoPreview && (
            <div className="relative group">
              <img
                src={photoPreview}
                alt="Preview"
                className="w-12 h-12 rounded-lg object-cover border border-paper-border shadow-xs"
              />
              <button
                type="button"
                onClick={() => {
                  setPhotoPreview(null);
                  setPhotoUrl('');
                }}
                className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white rounded-full p-0.5 shadow-sm"
                title="Remove photo"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-3 border-t border-paper-border">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary text-xs py-2 px-4 rounded-xl"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn-primary text-xs py-2 px-5 rounded-xl font-semibold flex items-center gap-2"
          disabled={isSubmitting}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isSubmitting ? 'Submitting QC Review...' : 'Submit Quality Review'}</span>
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
