import React, { useState } from 'react';
import { Student } from '../../types';
import { Modal } from '../common/Modal';
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
  Building2,
  Sun,
  UserCheck,
  Award,
} from 'lucide-react';

interface StudentCardProps {
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
      <div className="paper-card p-5 sm:p-6 bg-white relative flex flex-col justify-between group hover:-translate-y-0.5">
        {/* Top Badges & Header */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-marigold-600 text-white font-heading font-bold text-sm flex items-center justify-center shadow-xs">
                {initials}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-heading font-bold text-ink-900 group-hover:text-marigold-700 transition-colors">
                  {student.name}
                </h3>
                <p className="text-[11px] text-ink-500 flex items-center gap-1">
                  <span>Age {student.age}</span>
                  <span>•</span>
                  <span className="font-medium text-ink-700">{student.qualification}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              {/* Student Trust & Engagement Rating */}
              <StarRating
                score={student.avg_rating || 4.8}
                reviewCount={student.rating_count || 8}
                showTopRatedBadge={true}
                size="xs"
                onClick={() => setIsRatingModalOpen(true)}
                className="cursor-pointer"
              />

              {isRecent && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wide bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>New</span>
                </span>
              )}
            </div>
          </div>

          {/* College Name */}
          <div className="flex items-center gap-1.5 text-xs text-ink-600 font-medium mb-1">
            <Building2 className="w-3.5 h-3.5 text-ink-400 shrink-0" />
            <span className="truncate">{student.collegeName}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-ink-600 font-medium mb-3">
            <MapPin className="w-3.5 h-3.5 text-marigold-600 shrink-0" />
            <span className="truncate">{student.area}, {student.city}</span>
          </div>

          {/* Preferred Work Type */}
          <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 mb-3">
            <span className="text-[10px] uppercase tracking-wider font-bold text-amber-900 block mb-0.5">
              Preferred Work:
            </span>
            <p className="text-xs font-semibold text-ink-900 truncate">
              {student.preferredWorkType}
              {student.customWorkType ? ` (${student.customWorkType})` : ''}
            </p>
          </div>

          {/* Preferred Time of Day */}
          {student.preferredTimeOfDay && student.preferredTimeOfDay.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 mb-3">
              <Sun className="w-3 h-3 text-ink-400" />
              <span className="text-[11px] text-ink-500 font-medium mr-1">Shifts:</span>
              {student.preferredTimeOfDay.map((shift) => (
                <span
                  key={shift}
                  className="px-2 py-0.5 rounded text-[10px] bg-paper-200 text-ink-700 font-medium"
                >
                  {shift}
                </span>
              ))}
            </div>
          )}

          {/* Skills Tags */}
          <div>
            <span className="text-[11px] font-medium text-ink-400 block mb-1.5">
              Skills:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {student.skills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded-md text-xs bg-paper-100 text-ink-700 border border-paper-border"
                >
                  {skill}
                </span>
              ))}
              {student.skills.length > 4 && (
                <span className="px-1.5 py-0.5 rounded-md text-[11px] text-ink-500 bg-paper-200">
                  +{student.skills.length - 4} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section: Availability & Action */}
        <div className="mt-5 pt-4 border-t border-paper-border">
          <div className="grid grid-cols-2 gap-2 text-xs mb-4">
            <div className="flex items-center gap-1.5 text-ink-600">
              <Calendar className="w-3.5 h-3.5 text-ink-400 shrink-0" />
              <span className="font-medium truncate">
                {student.daysAvailable.join(', ')}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-ink-600 justify-end">
              <Clock className="w-3.5 h-3.5 text-tealdeep-600 shrink-0" />
              <span className="font-bold text-tealdeep-800">
                {student.hoursPerDay}h/day ({student.totalHoursPerWeek}h/wk)
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex-1 btn-teal text-xs sm:text-sm py-2 rounded-xl"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>View Profile & Hire</span>
            </button>

            <button
              type="button"
              onClick={() => setIsRatingModalOpen(true)}
              className="btn-secondary text-xs px-3 rounded-xl"
              title="View Verified Employer Reviews of Student"
            >
              <Award className="w-4 h-4 text-amber-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Student Profile Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={student.name}
        subtitle={`${student.qualification} • ${student.collegeName} (Age ${student.age})`}
      >
        <div className="space-y-4 text-sm">
          <div className="bg-[#FAF7F2] p-4 rounded-xl border border-paper-border space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-ink-500">Student Reliability Rating:</span>
              <StarRating score={student.avg_rating || 4.8} reviewCount={student.rating_count || 8} size="xs" />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-ink-500">Locality:</span>
              <span className="font-bold text-ink-900">{student.area}, {student.city}, {student.state}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-ink-500">Availability:</span>
              <span className="font-bold text-tealdeep-800">
                {student.daysAvailable.join(', ')} ({student.hoursPerDay} hrs/day)
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-ink-500">Total Commitment:</span>
              <span className="font-bold text-marigold-800">
                {student.totalHoursPerWeek} hrs / week
              </span>
            </div>
            {student.phone && (
              <div className="flex justify-between items-center text-xs pt-1 border-t border-paper-border">
                <span className="text-ink-500">Phone:</span>
                <span className="font-bold text-ink-900">{student.phone}</span>
              </div>
            )}
          </div>

          <div>
            <h5 className="font-semibold text-ink-900 mb-1">Preferred Role:</h5>
            <p className="text-xs text-ink-600">
              {student.preferredWorkType}
              {student.customWorkType ? ` (${student.customWorkType})` : ''}
              {student.preferredTimeOfDay.length > 0 && ` • Preferred shifts: ${student.preferredTimeOfDay.join(', ')}`}
            </p>
          </div>

          <div>
            <h5 className="font-semibold text-ink-900 mb-1.5">Skills & Strengths:</h5>
            <div className="flex flex-wrap gap-1.5">
              {student.skills.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-lg text-xs bg-tealdeep-50 text-tealdeep-900 border border-tealdeep-200"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-paper-border flex flex-col gap-2">
            {!contacted ? (
              <button
                type="button"
                onClick={() => setContacted(true)}
                className="btn-primary w-full py-2.5 rounded-xl text-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Send Hiring Offer / Interview Invitation</span>
              </button>
            ) : (
              <div className="bg-tealdeep-50 text-tealdeep-800 p-3 rounded-xl border border-tealdeep-200 flex items-center justify-center gap-2 text-xs font-semibold">
                <Check className="w-4 h-4 text-tealdeep-700" />
                <span>Offer Invitation Sent to Student!</span>
              </div>
            )}

            {student.phone && (
              <a
                href={`tel:${student.phone}`}
                className="btn-secondary w-full py-2.5 rounded-xl text-sm text-center"
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
