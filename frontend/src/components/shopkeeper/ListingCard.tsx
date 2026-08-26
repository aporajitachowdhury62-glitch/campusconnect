import React, { useState } from 'react';
import { Shopkeeper } from '../../types';
import { Modal } from '../common/Modal';
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
} from 'lucide-react';

interface ListingCardProps {
  listing: Shopkeeper;
  isRecent?: boolean;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, isRecent }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applied, setApplied] = useState(false);

  return (
    <>
      <div className="paper-card p-5 sm:p-6 bg-white relative flex flex-col justify-between group hover:-translate-y-0.5">
        {/* Top Badges & Header */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-tealdeep-50 text-tealdeep-800 border border-tealdeep-200/80">
                <Store className="w-3 h-3" />
                <span>{listing.category}</span>
              </span>

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
          <p className="text-xs text-ink-500 flex items-center gap-1.5 mt-0.5">
            <span>Owner: <strong className="text-ink-700 font-medium">{listing.ownerName}</strong></span>
            <ShieldCheck className="w-3.5 h-3.5 text-tealdeep-600 inline" />
          </p>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-ink-600 font-medium mt-2">
            <MapPin className="w-3.5 h-3.5 text-marigold-600 shrink-0" />
            <span className="truncate">{listing.area}, {listing.city}</span>
          </div>

          {/* Help Needed Highlight Box */}
          <div className="mt-3.5 p-3 rounded-xl bg-marigold-50/70 border border-marigold-200/80">
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

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full btn-primary text-xs sm:text-sm py-2 rounded-xl"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Connect & Apply</span>
          </button>
        </div>
      </div>

      {/* Detail / Contact Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={listing.shopName}
        subtitle={`${listing.category} • ${listing.area}, ${listing.city}`}
      >
        <div className="space-y-4 text-sm">
          <div className="bg-[#FAF7F2] p-4 rounded-xl border border-paper-border space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-ink-500">Contact Person:</span>
              <span className="font-bold text-ink-900">{listing.ownerName}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-ink-500">Phone Number:</span>
              <a
                href={`tel:${listing.contactNumber}`}
                className="font-bold text-marigold-700 hover:underline flex items-center gap-1"
              >
                <Phone className="w-3 h-3" />
                {listing.contactNumber}
              </a>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-ink-500">Weekly Commitment:</span>
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

          <div>
            <h5 className="font-semibold text-ink-900 mb-1">Role Description & Need:</h5>
            <p className="text-xs text-ink-600">
              The shopkeeper needs reliable student assistance for <strong>{listing.helpNeeded}</strong> on{' '}
              {listing.daysNeeded.join(', ')} ({listing.hoursPerDay} hours per shift).
            </p>
          </div>

          <div>
            <h5 className="font-semibold text-ink-900 mb-1.5">Required Skills:</h5>
            <div className="flex flex-wrap gap-1.5">
              {listing.skillsRequired.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-lg text-xs bg-amber-50 text-amber-900 border border-amber-200"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-paper-border flex flex-col gap-2">
            {!applied ? (
              <button
                type="button"
                onClick={() => setApplied(true)}
                className="btn-teal w-full py-2.5 rounded-xl text-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Express Interest / Send Quick SMS</span>
              </button>
            ) : (
              <div className="bg-tealdeep-50 text-tealdeep-800 p-3 rounded-xl border border-tealdeep-200 flex items-center justify-center gap-2 text-xs font-semibold">
                <Check className="w-4 h-4 text-tealdeep-700" />
                <span>Interest Sent! The shopkeeper can now call you directly.</span>
              </div>
            )}
            
            <a
              href={`tel:${listing.contactNumber}`}
              className="btn-secondary w-full py-2.5 rounded-xl text-sm text-center"
            >
              <Phone className="w-4 h-4 text-ink-600" />
              <span>Call Shopkeeper Directly ({listing.contactNumber})</span>
            </a>
          </div>
        </div>
      </Modal>
    </>
  );
};
