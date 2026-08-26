import React from 'react';
import { Link } from 'react-router-dom';
import { SearchX, RotateCcw, PlusCircle, Store, GraduationCap } from 'lucide-react';
import { UserRole } from '../../types';

interface EmptyStateProps {
  role: UserRole;
  onResetFilters: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ role, onResetFilters }) => {
  const isStudent = role === 'student';

  return (
    <div className="paper-card p-8 sm:p-12 text-center bg-white border-dashed border-2 border-paper-border max-w-xl mx-auto my-8 animate-in fade-in zoom-in-95 duration-200">
      <div className="w-16 h-16 rounded-2xl bg-paper-200 text-ink-500 flex items-center justify-center mx-auto mb-4 border border-paper-border shadow-xs">
        <SearchX className="w-8 h-8 text-ink-400" />
      </div>

      <h3 className="text-xl font-heading font-bold text-ink-900 mb-2">
        No matches yet — check back soon
      </h3>
      
      <p className="text-xs sm:text-sm text-ink-600 max-w-md mx-auto mb-6">
        {isStudent
          ? 'No shopkeeper gigs match your current filter criteria in this locality. Try expanding your search or clearing active filters.'
          : 'No student profiles match these skill or availability criteria. Try resetting filters or inviting students from nearby campuses.'}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onResetFilters}
          type="button"
          className="btn-secondary w-full sm:w-auto text-xs sm:text-sm py-2 px-4"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>

        {isStudent ? (
          <Link
            to="/shopkeeper-signup"
            className="btn-primary w-full sm:w-auto text-xs sm:text-sm py-2 px-4"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Are you a shopkeeper? Post a gig</span>
          </Link>
        ) : (
          <Link
            to="/student-signup"
            className="btn-teal w-full sm:w-auto text-xs sm:text-sm py-2 px-4"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Are you a student? Join the talent pool</span>
          </Link>
        )}
      </div>
    </div>
  );
};
