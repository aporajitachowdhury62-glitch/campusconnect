import React, { useState } from 'react';
import { Shopkeeper } from '../../types';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { VendorQABadge } from '../qaqc/VendorQABadge';
import { VendorQADetailModal } from '../qaqc/VendorQADetailModal';
import { StarRating } from '../rating/StarRating';
import { UserProfileRatingModal } from '../rating/UserProfileRatingModal';
import { RequestStatusBadge } from '../tracker/RequestStatusBadge';
import {
  Store,
  MapPin,
  Clock,
  Calendar,
  Phone,
  Banknote,
  Check,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  Send,
  ExternalLink,
  ChevronRight,
  Award,
} from 'lucide-react';

interface ListingCardProps {
  listing: Shopkeeper;
  isRecent?: boolean;
  onNavigateToApplications?: () => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  isRecent,
  onNavigateToApplications,
}) => {
  const { sendConnection, updateShopkeeperQA } = useApp();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isQAModalOpen, setIsQAModalOpen] = useState(false);
  const [isRatingProfileModalOpen, setIsRatingProfileModalOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  const isFoodVendor =
    listing.category === 'Food/restaurant' || Boolean(listing.qa_status);

  const handleSendApplication = async () => {
    try {
      setIsSending(true);
      await sendConnection(listing, customMsg.trim() || undefined);
      setApplicationSuccess(true);
    } catch (e) {
      console.error('Failed sending application', e);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="paper-card p-5 sm:p-6 bg-white relative flex flex-col justify-between group hover:-translate-y-0.5">
        {/* Top Badges & Header */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-tealdeep-50 text-tealdeep-800 border border-tealdeep-200/80">
                <Store className="w-3 h-3" />
                <span>{listing.category}</span>
              </span>

              {/* Food QA Badge on listing card top corner */}
              {isFoodVendor && (
                <VendorQABadge
                  status={listing.qa_status || 'pending'}
                  size="xs"
                  onClick={() => setIsQAModalOpen(true)}
                  className="cursor-pointer"
                />
              )}

              {isRecent && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wide bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Just Added</span>
                </span>
              )}
            </div>

            {listing.payEstimate && (
              <span className="text-xs font-bold text-ink-800 bg-paper-200 px-2 py-1 rounded-md border border-paper-border whitespace-nowrap">
                {listing.payEstimate}
              </span>
            )}
          </div>

          {/* Shop Name & Owner */}
          <h3 className="text-lg sm:text-xl font-heading font-bold text-ink-900 group-hover:text-marigold-700 transition-colors">
            {listing.shopName}
          </h3>

          {/* Owner + Two-Sided Platform Rating */}
          <div className="flex items-center justify-between gap-2 mt-1">
            <p className="text-xs text-ink-500 flex items-center gap-1.5">
              <span>Owner: <strong className="text-ink-700 font-medium">{listing.ownerName}</strong></span>
              <ShieldCheck className="w-3.5 h-3.5 text-tealdeep-600 inline" />
            </p>

            {/* Universal Star Rating for all shop categories */}
            <StarRating
              score={listing.avg_rating || 4.7}
              reviewCount={listing.rating_count || 12}
              showTopRatedBadge={true}
              size="xs"
              onClick={() => setIsRatingProfileModalOpen(true)}
              className="cursor-pointer"
            />
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-ink-600 font-medium mt-2">
            <MapPin className="w-3.5 h-3.5 text-marigold-600 shrink-0" />
            <span className="truncate">{listing.area}, {listing.city}</span>
          </div>

          {/* Food QA Quick Verification Teaser for restaurants */}
          {isFoodVendor && (
            <button
              type="button"
              onClick={() => setIsQAModalOpen(true)}
              className="w-full mt-3 p-2.5 rounded-xl bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200 text-left transition-colors flex items-center justify-between group/qa text-xs"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="font-semibold text-ink-800">
                  {listing.qa_status === 'verified'
                    ? 'FSSAI License & Hygiene Verified'
                    : 'Process QA Safety Audit'}
                </span>
              </div>
              <span className="text-[11px] text-marigold-800 font-bold group-hover/qa:underline flex items-center">
                <span>Inspect QA</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </button>
          )}

          {/* Help Needed Highlight Box */}
          <div className="mt-3 p-3 rounded-xl bg-marigold-50/70 border border-marigold-200/80">
            <span className="text-[11px] uppercase tracking-wider font-bold text-marigold-900 block mb-0.5">
              Help Needed:
            </span>
            <p className="text-sm font-semibold text-ink-900">
              {listing.helpNeeded}
              {listing.customHelpNeeded ? ` (${listing.customHelpNeeded})` : ''}
            </p>
          </div>

          {/* Required Skills Tags */}
          <div className="mt-3">
            <span className="text-[11px] font-medium text-ink-400 block mb-1.5">
              Required Skills:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {listing.skillsRequired.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded-md text-xs bg-paper-100 text-ink-700 border border-paper-border"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section: Schedule & Action */}
        <div className="mt-5 pt-4 border-t border-paper-border">
          <div className="grid grid-cols-2 gap-2 text-xs mb-4">
            <div className="flex items-center gap-1.5 text-ink-600">
              <Calendar className="w-3.5 h-3.5 text-ink-400 shrink-0" />
              <span className="font-medium truncate">
                {listing.daysNeeded.join(', ')}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-ink-600 justify-end">
              <Clock className="w-3.5 h-3.5 text-ink-400 shrink-0" />
              <span className="font-bold text-ink-900">
                {listing.hoursPerDay}h/day ({listing.totalHoursPerWeek}h/wk)
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setApplicationSuccess(false);
                setIsContactModalOpen(true);
              }}
              className="flex-1 btn-primary text-xs sm:text-sm py-2.5 rounded-xl font-semibold flex items-center justify-center gap-1.5 shadow-warm-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Connect & Apply</span>
            </button>

            <button
              type="button"
              onClick={() => setIsRatingProfileModalOpen(true)}
              className="btn-secondary text-xs px-3 rounded-xl"
              title="View Employer Ratings & Engagement Reviews"
            >
              <Award className="w-4 h-4 text-amber-600" />
            </button>

            {isFoodVendor && (
              <button
                type="button"
                onClick={() => setIsQAModalOpen(true)}
                className="btn-secondary text-xs px-3 rounded-xl"
                title="View QA Checklist (FSSAI / Hygiene)"
              >
                <ShieldCheck className="w-4 h-4 text-tealdeep-700" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Connection & Application Modal */}
      <Modal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        title={listing.shopName}
        subtitle={`${listing.category} • ${listing.area}, ${listing.city}`}
      >
        <div className="space-y-4 text-sm">
          {/* Shop Quick Specs */}
          <div className="bg-[#FAF7F2] p-4 rounded-xl border border-paper-border space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-ink-500">Contact Person:</span>
              <span className="font-bold text-ink-900">{listing.ownerName}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-ink-500">Employer Rating:</span>
              <StarRating score={listing.avg_rating || 4.7} reviewCount={listing.rating_count || 12} size="xs" />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-ink-500">Shift Commitment:</span>
              <span className="font-bold text-tealdeep-800">
                {listing.daysNeeded.join(', ')} • {listing.totalHoursPerWeek} hrs/week
              </span>
            </div>
            {listing.payEstimate && (
              <div className="flex justify-between items-center text-xs pt-1 border-t border-paper-border">
                <span className="text-ink-500">Stipend Estimate:</span>
                <span className="font-bold text-ink-900">{listing.payEstimate}</span>
              </div>
            )}
          </div>

          {!applicationSuccess ? (
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-ink-800 mb-1">
                  Your Message to {listing.ownerName} (Optional)
                </label>
                <textarea
                  rows={3}
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  placeholder={`Hi ${listing.ownerName}, I'm interested in the ${listing.helpNeeded} role! I have experience and live nearby...`}
                  className="w-full paper-input text-xs leading-relaxed"
                />
                <p className="text-[11px] text-ink-400 mt-1">
                  Once sent, you can track its delivery (Sent ✓, Seen ✓✓, Accepted) in real-time.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  disabled={isSending}
                  onClick={handleSendApplication}
                  className="btn-teal w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSending ? 'Sending Request...' : 'Send Application (WhatsApp-style Tick)'}</span>
                </button>

                <a
                  href={`tel:${listing.contactNumber}`}
                  className="btn-secondary w-full py-2 rounded-xl text-xs text-center flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-ink-500" />
                  <span>Or Call Shopkeeper Directly ({listing.contactNumber})</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-1 animate-in fade-in">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-bold text-base text-ink-900">
                  Connection Request Dispatched!
                </h4>
                <div className="flex justify-center">
                  <RequestStatusBadge status="sent" size="sm" />
                </div>
                <p className="text-xs text-ink-600 max-w-sm mx-auto">
                  Your application has been delivered to <strong>{listing.ownerName}</strong>. As soon as the shopkeeper views or accepts your message, your status tick will update in real time.
                </p>
              </div>

              <div className="flex gap-2">
                {onNavigateToApplications && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsContactModalOpen(false);
                      onNavigateToApplications();
                    }}
                    className="btn-primary flex-1 py-2.5 rounded-xl text-xs font-semibold"
                  >
                    View in "My Applications" Tracker →
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  className="btn-secondary text-xs py-2.5 px-4 rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* User / Shopkeeper Profile Rating Modal */}
      <UserProfileRatingModal
        isOpen={isRatingProfileModalOpen}
        onClose={() => setIsRatingProfileModalOpen(false)}
        userId={listing.id}
        userName={listing.shopName}
        userRole="shopkeeper"
        subtitle={`${listing.category} • ${listing.area}, ${listing.city} • Owned by ${listing.ownerName}`}
      />

      {/* Full QA/QC Detail Modal (for food listings) */}
      {isFoodVendor && (
        <VendorQADetailModal
          isOpen={isQAModalOpen}
          onClose={() => setIsQAModalOpen(false)}
          vendorId={listing.id}
          vendorName={listing.shopName}
          category={listing.category}
          location={`${listing.area}, ${listing.city}`}
          onQAUpdated={(updated) => updateShopkeeperQA(listing.id, updated)}
        />
      )}
    </>
  );
};
