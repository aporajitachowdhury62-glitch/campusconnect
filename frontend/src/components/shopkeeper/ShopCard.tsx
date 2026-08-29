import React, { useState } from 'react';
import { Shopkeeper } from '../../types';
import { Modal } from '../common/Modal';
import { RoleBadge } from '../common/RoleBadge';
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
  Sparkles,
  Send,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export interface ShopCardProps {
  shop?: Shopkeeper;
  listing?: Shopkeeper; // Alias for shop prop
  isRecent?: boolean;
  onNavigateToApplications?: () => void;
  className?: string;
}

export const ShopCard: React.FC<ShopCardProps> = ({
  shop,
  listing: propListing,
  isRecent,
  onNavigateToApplications,
  className = '',
}) => {
  const listing = shop || propListing;
  const { sendConnection } = useApp();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isQAModalOpen, setIsQAModalOpen] = useState(false);
  const [isRatingProfileModalOpen, setIsRatingProfileModalOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  if (!listing) {
    return null;
  }

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
      <div className={`paper-card p-5 sm:p-6 bg-white relative flex flex-col justify-between group hover:-translate-y-0.5 transition-all shadow-2xs border border-paper-border rounded-2xl ${className}`}>
        {/* Top Badges & Header */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-tealdeep-50 text-tealdeep-800 border border-tealdeep-200/80">
                <Store className="w-3 h-3" />
                <span>{listing.category}</span>
              </span>

              {/* Role Badge */}
              <RoleBadge role="Shopkeeper" size="xs" />

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

            {/* Universal Star Rating using rating and totalReviews props */}
            <StarRating
              rating={listing.avg_rating || 4.7}
              totalReviews={listing.rating_count || 12}
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
              className="flex-1 btn-primary py-2.5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Apply / Connect</span>
            </button>

            <button
              type="button"
              onClick={() => setIsRatingProfileModalOpen(true)}
              className="p-2.5 rounded-xl border border-paper-border hover:bg-paper-100 text-ink-600 hover:text-ink-900 transition-colors"
              title="View Owner Reviews & Ratings"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Direct Application & Contact Modal */}
      <Modal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        title={listing.shopName}
        subtitle={`${listing.category} • ${listing.area}, ${listing.city}`}
      >
        <div className="space-y-5">
          {applicationSuccess ? (
            <div className="text-center py-6 space-y-3 animate-in fade-in">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-bold text-lg text-ink-900">
                Application Sent to {listing.ownerName}!
              </h4>
              <p className="text-xs text-ink-600 max-w-sm mx-auto">
                Your profile and contact note have been submitted to the shopkeeper's inbox. Track status in your dashboard.
              </p>
              <div className="flex justify-center gap-2 pt-2">
                <RequestStatusBadge status="sent" size="md" />
              </div>
              <div className="pt-4 flex gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsContactModalOpen(false);
                    if (onNavigateToApplications) onNavigateToApplications();
                  }}
                  className="btn-primary py-2 px-4 text-xs"
                >
                  View My Applications
                </button>
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  className="btn-secondary py-2 px-4 text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Employer Info Preview */}
              <div className="p-3.5 rounded-xl bg-paper-100 border border-paper-border space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-500">Owner Contact:</span>
                  <span className="font-bold text-ink-800 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-tealdeep-600" />
                    {listing.contactNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-500">Position Needed:</span>
                  <span className="font-semibold text-ink-900">{listing.helpNeeded}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-500">Time Commitment:</span>
                  <span className="font-semibold text-ink-900">{listing.hoursPerDay} hrs/day • {listing.daysNeeded.join(', ')}</span>
                </div>
              </div>

              {/* Custom Intro Message */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-ink-800">
                  Add a friendly intro note (Optional):
                </label>
                <textarea
                  rows={3}
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  placeholder={`Hi ${listing.ownerName}, I am available on ${listing.daysNeeded.slice(0, 2).join(', ')} and have experience with ${listing.skillsRequired[0] || 'this work'}...`}
                  className="input-field text-xs resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-paper-border">
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  className="btn-secondary py-2 px-4 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendApplication}
                  disabled={isSending}
                  className="btn-primary py-2 px-5 text-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSending ? 'Sending...' : 'Confirm & Send Application'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* QA Inspection Detail Modal */}
      <VendorQADetailModal
        isOpen={isQAModalOpen}
        onClose={() => setIsQAModalOpen(false)}
        vendorId={listing.id}
        vendorName={listing.shopName}
        category={listing.category}
        initialStatus={listing.qa_status || 'pending'}
      />

      {/* Two-Sided Platform Ratings Profile Modal */}
      <UserProfileRatingModal
        isOpen={isRatingProfileModalOpen}
        onClose={() => setIsRatingProfileModalOpen(false)}
        userId={listing.id}
        userName={listing.shopName}
        userRole="shopkeeper"
        subtitle={`Owner: ${listing.ownerName} • ${listing.category} • ${listing.area}`}
      />
    </>
  );
};

export default ShopCard;
