import React, { useState } from 'react';
import { Student } from '../../types';
import { Modal } from '../common/Modal';
import { RoleBadge } from '../common/RoleBadge';
import { StarRating } from '../rating/StarRating';
import { UserProfileRatingModal } from '../rating/UserProfileRatingModal';
import {
  GraduationCap,
  MapPin,
  Clock,
  Calendar,
  Phone,
  Sparkles,
  Check,
} from 'lucide-react';

export interface StudentCardProps {
  student: Student;
  isRecent?: boolean;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student, isRecent }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [contacted, setContacted] = useState(false);

  // Generate initials
  const initials = student.name
    ? student.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'ST';

  return (
    <>
      <div className="paper-card p-5 sm:p-6 bg-white relative flex flex-col justify-between group hover:-translate-y-0.5 transition-all shadow-2xs border border-paper-border rounded-2xl">
        {/* Top Badges & Header */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-marigold-50 text-marigold-900 border border-marigold-200">
                <GraduationCap className="w-3 h-3" />
                <span>{student.qualification}</span>
              </span>

              <RoleBadge role="Student" size="xs" />

              {isRecent && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wide bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>New Student</span>
                </span>
              )}
            </div>

            <span className="text-xs font-bold text-ink-700 bg-paper-200 px-2 py-0.5 rounded-md border border-paper-border">
              {student.age} yrs
            </span>
          </div>

          {/* Student Profile Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-marigold-400 to-marigold-600 text-white font-heading font-bold text-sm flex items-center justify-center shadow-2xs shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-heading font-bold text-ink-900 truncate group-hover:text-marigold-700 transition-colors">
                {student.name}
              </h3>
              <p className="text-xs text-ink-500 truncate">
                {student.collegeName}
              </p>
            </div>
          </div>

          {/* Location & Rating */}
          <div className="flex items-center justify-between gap-2 text-xs text-ink-600 mt-2">
            <div className="flex items-center gap-1 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-marigold-600 shrink-0" />
              <span className="truncate">{student.area}, {student.city}</span>
            </div>

            <StarRating
              rating={student.avg_rating || 4.8}
              totalReviews={student.rating_count || 9}
              showTopRatedBadge={true}
              size="xs"
              onClick={() => setIsRatingModalOpen(true)}
              className="cursor-pointer"
            />
          </div>

          {/* Preferred Work Type */}
          <div className="mt-3 p-2.5 rounded-xl bg-paper-100 border border-paper-border">
            <span className="text-[10px] uppercase font-bold text-ink-400 block tracking-wider mb-0.5">
              Preferred Work:
            </span>
            <p className="text-xs font-semibold text-ink-900 truncate">
              {student.preferredWorkType}
            </p>
          </div>

          {/* Skills Badges */}
          <div className="mt-3">
            <span className="text-[11px] font-medium text-ink-400 block mb-1">
              Skills:
            </span>
            <div className="flex flex-wrap gap-1">
              {student.skills.slice(0, 4).map((sk) => (
                <span
                  key={sk}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-paper-50 text-ink-700 border border-paper-border"
                >
                  {sk}
                </span>
              ))}
              {student.skills.length > 4 && (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] text-ink-400 bg-paper-200">
                  +{student.skills.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card Footer: Hours & Connect CTA */}
        <div className="mt-4 pt-3 border-t border-paper-border flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-ink-600">
            <Clock className="w-3.5 h-3.5 text-ink-400 shrink-0" />
            <span>
              <strong>{student.hoursPerDay}h/day</strong> ({student.daysAvailable.length} days/wk)
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn-primary py-1.5 px-3.5 text-xs font-semibold"
          >
            Connect
          </button>
        </div>
      </div>

      {/* Connect Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Connect with ${student.name}`}
        subtitle={`${student.collegeName} • ${student.qualification}`}
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-paper-100 border border-paper-border space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-ink-500">Days Available:</span>
              <span className="font-semibold text-ink-900">{student.daysAvailable.join(', ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-500">Preferred Shift:</span>
              <span className="font-semibold text-ink-900">{student.preferredTimeOfDay.join(', ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-500">Total Commitment:</span>
              <span className="font-bold text-ink-900">{student.totalHoursPerWeek} hrs/week</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setContacted(true)}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                contacted
                  ? 'bg-emerald-600 text-white'
                  : 'btn-primary'
              }`}
            >
              {contacted ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Invitation Sent!</span>
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4" />
                  <span>Send Gig Invitation</span>
                </>
              )}
            </button>

            {student.phone && (
              <a
                href={`tel:${student.phone}`}
                className="btn-secondary w-full py-2.5 rounded-xl text-sm text-center flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-ink-600" />
                <span>Direct Call ({student.phone})</span>
              </a>
            )}
          </div>
        </div>
      </Modal>

      {/* Student Ratings & Reviews Modal */}
      <UserProfileRatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        userId={student.id}
        userName={student.name}
        userRole="student"
        subtitle={`${student.qualification} • ${student.collegeName} • ${student.area}, ${student.city}`}
      />
    </>
  );
};

export default StudentCard;
