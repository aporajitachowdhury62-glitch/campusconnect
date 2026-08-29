import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  Clock,
  Plus,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { VendorQAQC, Review, QAStatus } from '../../types';
import { VendorQABadge } from './VendorQABadge';
import { VendorQCRating } from './VendorQCRating';
import { ReviewList } from './ReviewList';
import { ReviewForm } from './ReviewForm';
import { vendorService } from '../../services/vendorService';

export interface VendorQADetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorId: string;
  vendorName: string;
  category: string;
  location?: string;
  initialStatus?: QAStatus;
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
      console.error('Failed loading vendor QA detail', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && vendorId) {
      loadData();
    }
  }, [isOpen, vendorId]);

  const handleReviewSubmitted = async (
    newReview: Omit<Review, 'id' | 'created_at' | 'flagged'>
  ) => {
    try {
      const created = await vendorService.addReview(newReview);
      setReviews((prev) => [created, ...prev]);
      setShowReviewForm(false);
      const updatedQA = await vendorService.fetchVendorQA(vendorId);
      setQaData(updatedQA);
      if (onQAUpdated && updatedQA) onQAUpdated(updatedQA);
    } catch (e) {
      console.error('Failed adding review', e);
    }
  };

  const handleReportIssue = async (reason: string) => {
    try {
      const updated = await vendorService.flagReview(vendorId, reason);
      setQaData(updated);
      if (onQAUpdated) onQAUpdated(updated);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={vendorName}
      subtitle={`${category} • ${location || 'Campus Neighborhood'} • Quality & Hygiene Audit`}
    >
      <div className="space-y-5">
        {/* Top Summary Banner */}
        <div className="p-4 rounded-2xl bg-paper-100 border border-paper-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-tealdeep-50 text-tealdeep-800 border border-tealdeep-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-heading font-bold text-sm text-ink-900">
                  {vendorName}
                </h4>
                <VendorQABadge status={qaData?.qa_status || 'pending'} size="xs" />
              </div>
              <p className="text-[11px] text-ink-500">
                Verified compliance with CampusConnect hyperlocal quality and hygiene standards.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <VendorQCRating
              score={qaData?.qc_score || 0}
              reviewCount={qaData?.qc_review_count || 0}
              size="md"
            />
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 border-b border-paper-border pb-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab('qa');
              setShowReviewForm(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'qa'
                ? 'bg-ink-900 text-white shadow-2xs'
                : 'bg-paper-50 text-ink-600 hover:bg-paper-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>FSSAI & Document Audits ({qaData?.qa_documents?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('qc')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'qc'
                ? 'bg-ink-900 text-white shadow-2xs'
                : 'bg-paper-50 text-ink-600 hover:bg-paper-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Student QC Reviews ({reviews.length})</span>
          </button>

          {activeTab === 'qc' && !showReviewForm && (
            <button
              type="button"
              onClick={() => setShowReviewForm(true)}
              className="ml-auto btn-primary text-xs py-1 px-3 rounded-lg flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Write Review</span>
            </button>
          )}
        </div>

        {/* Tab 1: QA Checklist & Compliance */}
        {activeTab === 'qa' && (
          <div className="space-y-4">
            {isLoading ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-8 h-8 border-3 border-tealdeep-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-ink-500">Checking verification documents...</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-ink-400 block">
                    Document Checklist & Audit Trail
                  </span>

                  <div className="grid grid-cols-1 gap-2.5">
                    {qaData?.qa_documents && qaData.qa_documents.length > 0 ? (
                      qaData.qa_documents.map((doc) => (
                        <div
                          key={doc.id}
                          className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                            doc.verified
                              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                              : 'bg-paper-50 border-paper-border text-ink-800'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="mt-0.5">
                              {doc.verified ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              ) : (
                                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                              )}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-heading font-bold text-xs sm:text-sm">
                                  {doc.name}
                                </span>
                                <span
                                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                    doc.verified
                                      ? 'bg-emerald-200/80 text-emerald-900'
                                      : 'bg-amber-100 text-amber-900'
                                  }`}
                                >
                                  {doc.verified ? 'Verified' : 'Pending Check'}
                                </span>
                              </div>

                              {doc.docNumber && (
                                <p className="text-[11px] font-mono text-ink-600 mt-0.5">
                                  Reg/License #: <strong>{doc.docNumber}</strong>
                                </p>
                              )}

                              {doc.notes && (
                                <p className="text-xs text-ink-500 mt-1 italic">
                                  "{doc.notes}"
                                </p>
                              )}
                            </div>
                          </div>

                          {doc.fileUrl && (
                            <a
                              href={doc.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-tealdeep-700 hover:underline shrink-0 font-medium"
                            >
                              View Proof
                            </a>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-ink-500 p-4 text-center bg-paper-50 rounded-xl">
                        No verification documents filed yet.
                      </p>
                    )}
                  </div>
                </div>

                {/* Audit Information */}
                {qaData?.qa_verified_at && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                    <span>Last Inspection Passed:</span>
                    <strong>{new Date(qaData.qa_verified_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</strong>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Tab 2: QC Reviews Stream */}
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

export default VendorQADetailModal;
