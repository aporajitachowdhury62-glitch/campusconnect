import React, { useState, useEffect } from 'react';
import { Star, Flag, Image as ImageIcon, X } from 'lucide-react';
import { Review } from '../../types';
import { vendorService } from '../../services/vendorService';
import { INITIAL_REVIEWS } from '../../data/mockData';

export interface ReviewListProps {
  reviews?: Review[];
  vendorId?: string;
  vendorName?: string;
  onReportIssue?: (reason: string) => Promise<void>;
  isLoading?: boolean;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews: propReviews,
  vendorId,
  vendorName = 'Campus Establishment',
  onReportIssue,
  isLoading: propLoading = false,
}) => {
  const [internalReviews, setInternalReviews] = useState<Review[]>(propReviews || []);
  const [loading, setLoading] = useState<boolean>(propLoading);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [flagModalOpen, setFlagModalOpen] = useState<boolean>(false);
  const [flagReason, setFlagReason] = useState<string>('');
  const [flagCategory, setFlagCategory] = useState<string>('hygiene');
  const [isReporting, setIsReporting] = useState<boolean>(false);
  const [reportSuccess, setReportSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (propReviews) {
      setInternalReviews(propReviews);
    } else if (vendorId) {
      setLoading(true);
      vendorService
        .fetchVendorReviews(vendorId)
        .then((data) => setInternalReviews(data && data.length > 0 ? data : INITIAL_REVIEWS))
        .catch(() => setInternalReviews(INITIAL_REVIEWS))
        .finally(() => setLoading(false));
    } else {
      setInternalReviews(INITIAL_REVIEWS);
    }
  }, [propReviews, vendorId]);

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flagReason.trim()) return;

    try {
      setIsReporting(true);
      if (onReportIssue) {
        await onReportIssue(`[Category: ${flagCategory.toUpperCase()}] ${flagReason.trim()}`);
      } else if (vendorId) {
        await vendorService.flagReview(vendorId, flagReason.trim());
      }
      setReportSuccess(true);
      setTimeout(() => {
        setReportSuccess(false);
        setFlagModalOpen(false);
        setFlagReason('');
      }, 1500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsReporting(false);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return 'Recently';
    }
  };

  if (loading) {
    return (
      <div className="py-8 text-center space-y-2">
        <div className="w-8 h-8 border-3 border-marigold-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-ink-500">Loading student quality reviews...</p>
      </div>
    );
  }

  if (internalReviews.length === 0) {
    return (
      <div className="py-8 px-4 text-center bg-paper-100/60 rounded-2xl border border-paper-border space-y-2">
        <div className="w-10 h-10 rounded-full bg-paper-200 text-ink-400 flex items-center justify-center mx-auto">
          <Star className="w-5 h-5" />
        </div>
        <h5 className="font-heading font-bold text-sm text-ink-800">
          No Reviews Yet for {vendorName}
        </h5>
        <p className="text-xs text-ink-500 max-w-sm mx-auto">
          Be the first student to review their food safety standards, kitchen hygiene, and shift experience!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Header with Report button */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-ink-700 uppercase tracking-wider">
          Verified Student Reviews ({internalReviews.length})
        </span>

        <button
          type="button"
          onClick={() => setFlagModalOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-lg transition-colors font-medium"
        >
          <Flag className="w-3.5 h-3.5" />
          <span>Report an Issue</span>
        </button>
      </div>

      {/* Reviews Stream */}
      <div className="space-y-3">
        {internalReviews.map((rev) => (
          <div
            key={rev.id}
            className="p-4 rounded-xl bg-white border border-paper-border shadow-2xs space-y-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-tealdeep-50 text-tealdeep-800 border border-tealdeep-200 flex items-center justify-center font-bold text-xs">
                  {rev.user_name ? rev.user_name.charAt(0) : 'S'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-ink-900">
                      {rev.user_name || 'Anonymous Student'}
                    </span>
                    <span className="text-[10px] text-tealdeep-700 font-semibold bg-tealdeep-50 px-1.5 py-0.2 rounded border border-tealdeep-200">
                      Verified Student
                    </span>
                  </div>
                  {rev.user_college && (
                    <span className="text-[11px] text-ink-400 block">
                      {rev.user_college}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-0.5 justify-end">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= rev.rating
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-ink-200 fill-transparent'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-ink-400 block mt-0.5">
                  {formatDate(rev.created_at)}
                </span>
              </div>
            </div>

            {/* Comment */}
            <p className="text-xs text-ink-700 leading-relaxed">
              {rev.comment}
            </p>

            {/* Tags */}
            {rev.tags && rev.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {rev.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-paper-100 text-ink-600 border border-paper-border font-medium"
                  >
                    ✓ {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Photo Attachment */}
            {rev.photo_url && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedPhoto(rev.photo_url!)}
                  className="group relative inline-block rounded-lg overflow-hidden border border-paper-border"
                >
                  <img
                    src={rev.photo_url}
                    alt="Review attachment"
                    className="w-20 h-14 object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-semibold gap-1">
                    <ImageIcon className="w-3 h-3" />
                    <span>View</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Photo Preview Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative max-w-lg w-full bg-white rounded-2xl p-2 shadow-2xl">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-ink-900 text-white flex items-center justify-center shadow-md hover:bg-ink-800"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={selectedPhoto}
              alt="Full preview"
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      {/* Flag Issue Modal */}
      {flagModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full border border-paper-border shadow-warm-lg space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-paper-border">
              <h4 className="font-heading font-bold text-sm text-ink-900 flex items-center gap-1.5 text-rose-700">
                <Flag className="w-4 h-4" />
                <span>Report Quality or Hygiene Concern</span>
              </h4>
              <button
                type="button"
                onClick={() => setFlagModalOpen(false)}
                className="text-ink-400 hover:text-ink-700"
              >
                ✕
              </button>
            </div>

            {reportSuccess ? (
              <div className="py-6 text-center text-xs text-emerald-800 font-semibold bg-emerald-50 rounded-xl">
                ✓ Report logged. Our Quality Inspection Team will audit this venue.
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-ink-800 mb-1">
                    Issue Category
                  </label>
                  <select
                    value={flagCategory}
                    onChange={(e) => setFlagCategory(e.target.value)}
                    className="w-full p-2 rounded-lg border border-paper-border bg-paper-50"
                  >
                    <option value="hygiene">Kitchen / Workplace Hygiene</option>
                    <option value="licensing">Missing FSSAI / Trade License</option>
                    <option value="safety">Unsafe Working Conditions</option>
                    <option value="payment">Unpaid Shift / Stipend Issue</option>
                    <option value="misconduct">Owner / Staff Misconduct</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-ink-800 mb-1">
                    Detailed Explanation
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={flagReason}
                    onChange={(e) => setFlagReason(e.target.value)}
                    placeholder="Describe what you observed regarding cleanliness or compliance..."
                    className="w-full p-2 rounded-lg border border-paper-border bg-paper-50 resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-paper-border">
                  <button
                    type="button"
                    onClick={() => setFlagModalOpen(false)}
                    className="btn-secondary text-xs py-2 px-3 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isReporting || !flagReason.trim()}
                    className="btn-primary text-xs py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-700"
                  >
                    {isReporting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
