import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Star,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Building2,
  Phone,
  Sparkles,
  Plus,
  X,
  ExternalLink,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { VendorQAQC, Review, QAStatus } from '../../types';
import { VendorQABadge } from './VendorQABadge';
import { VendorQCRating } from './VendorQCRating';
import { ReviewList } from './ReviewList';
import { ReviewForm } from './ReviewForm';
import { vendorService } from '../../services/vendorService';

interface VendorQADetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorId: string;
  vendorName: string;
  category: string;
  location: string;
  onQAUpdated?: (updatedQA: VendorQAQC) => void;
}

export const VendorQADetailModal: React.FC<VendorQADetailModalProps> = ({
  isOpen,
  onClose,
  vendorId,
  vendorName,
  category,
  location,
  onQAUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'qa' | 'qc'>('qa');
  const [qaData, setQaData] = useState<VendorQAQC | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [qa, revs] = await Promise.all([
        vendorService.fetchVendorQA(vendorId),
        vendorService.fetchVendorReviews(vendorId),
      ]);
      setQaData(qa);
      setReviews(revs);
    } catch (e) {
      console.error('Failed loading QA/QC data', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && vendorId) {
      loadData();
      setShowReviewForm(false);
    }
  }, [isOpen, vendorId]);

  const handleReviewSubmitted = async (
    reviewData: Omit<Review, 'id' | 'created_at' | 'flagged'>
  ) => {
    const { review, updatedQA } = await vendorService.submitReview(reviewData);
    setReviews((prev) => [review, ...prev]);
    setQaData(updatedQA);
    setShowReviewForm(false);
    if (onQAUpdated) {
      onQAUpdated(updatedQA);
    }
  };

  const handleReportIssue = async (reason: string) => {
    const updated = await vendorService.reportIssue(vendorId, reason);
    setQaData(updated);
    if (onQAUpdated) {
      onQAUpdated(updated);
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Not yet reviewed';
    try {
      return new Date(isoString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={vendorName}
      subtitle={`Food Vendor QA/QC Verification Hub • ${location}`}
    >
      <div className="space-y-4">
        {/* Header Summary Banner */}
        <div className="p-4 bg-gradient-to-r from-paper-100 to-amber-50/50 rounded-2xl border border-paper-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <VendorQABadge status={qaData?.qa_status || 'unverified'} size="md" />
              <VendorQCRating
                score={qaData?.qc_score || 0}
                reviewCount={qaData?.qc_review_count || reviews.length}
                size="md"
              />
            </div>
            <p className="text-xs text-ink-500 flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3 text-ink-400" />
              <span>Last QA Audit: <strong>{formatDate(qaData?.qa_verified_at)}</strong></span>
              {qaData?.qa_reviewed_by && (
                <span className="text-ink-400">({qaData.qa_reviewed_by})</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            {activeTab === 'qc' && !showReviewForm && (
              <button
                type="button"
                onClick={() => setShowReviewForm(true)}
                className="btn-primary text-xs py-2 px-3.5 rounded-xl w-full sm:w-auto flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Leave a Review</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-paper-border">
          <button
            type="button"
            onClick={() => setActiveTab('qa')}
            className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-heading font-bold border-b-2 transition-all flex items-center justify-center gap-2 ${
              activeTab === 'qa'
                ? 'border-marigold-600 text-marigold-900 bg-marigold-50/40'
                : 'border-transparent text-ink-500 hover:text-ink-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-tealdeep-700" />
            <span>Process QA Checklist (Safety & Licenses)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('qc')}
            className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-heading font-bold border-b-2 transition-all flex items-center justify-center gap-2 ${
              activeTab === 'qc'
                ? 'border-marigold-600 text-marigold-900 bg-marigold-50/40'
                : 'border-transparent text-ink-500 hover:text-ink-800'
            }`}
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>Quality Control (QC Reviews & Ratings)</span>
            <span className="px-1.5 py-0.5 rounded-full bg-paper-200 text-[10px] text-ink-700">
              {reviews.length}
            </span>
          </button>
        </div>

        {/* Tab 1: QA Checklist */}
        {activeTab === 'qa' && (
          <div className="space-y-3.5">
            <div className="text-xs text-ink-600 bg-paper-50 p-3 rounded-xl border border-paper-border flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-tealdeep-700 shrink-0 mt-0.5" />
              <span>
                <strong>Campus Safety Assurance:</strong> Before students apply or work at food businesses, CampusConnect audits official government licenses, kitchen hygiene protocols, and business registrations.
              </span>
            </div>

            {isLoading ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-6 h-6 border-2 border-marigold-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-ink-400">Verifying documents against central registry...</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {qaData?.qa_documents.map((doc) => (
                  <div
                    key={doc.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      doc.verified
                        ? 'bg-emerald-50/50 border-emerald-200/90'
                        : 'bg-paper-50 border-paper-border'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            doc.verified
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-paper-200 text-ink-400'
                          }`}
                        >
                          {doc.verified ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <h5 className="font-heading font-bold text-xs sm:text-sm text-ink-900 flex items-center gap-1.5">
                            <span>{doc.name}</span>
                            {doc.docNumber && (
                              <code className="text-[11px] px-1.5 py-0.2 rounded bg-white text-ink-700 border border-paper-border font-mono">
                                #{doc.docNumber}
                              </code>
                            )}
                          </h5>
                          {doc.notes && (
                            <p className="text-xs text-ink-600 mt-0.5 leading-relaxed">
                              {doc.notes}
                            </p>
                          )}
                          {doc.verifiedAt && (
                            <span className="text-[10px] text-emerald-800 font-semibold block mt-1">
                              ✓ Verified on {formatDate(doc.verifiedAt)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0">
                        {doc.verified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-300 px-2 py-0.5 rounded-md">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100/70 border border-amber-300 px-2 py-0.5 rounded-md">
                            <Clock className="w-3 h-3" />
                            <span>Pending</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: QC Reviews & Ratings */}
        {activeTab === 'qc' && (
          <div className="space-y-4">
            {showReviewForm ? (
              <ReviewForm
                vendorId={vendorId}
                vendorName={vendorName}
                onReviewSubmitted={handleReviewSubmitted}
                onCancel={() => setShowReviewForm(false)}
              />
            ) : (
              <ReviewList
                reviews={reviews}
                vendorName={vendorName}
                onReportIssue={handleReportIssue}
                isLoading={isLoading}
              />
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
