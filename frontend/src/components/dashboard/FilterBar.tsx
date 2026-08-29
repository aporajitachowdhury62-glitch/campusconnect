import {
  StudentFilters,
  ShopkeeperFilters,
} from '../../types';
import {
  SHOP_CATEGORY_OPTIONS,
  WORK_TYPE_OPTIONS,
  DAYS_OF_WEEK,
} from '../../data/mockData';
import { Search, RotateCcw, MapPin, Calendar, Filter, Tag, Briefcase } from 'lucide-react';

interface StudentFilterBarProps {
  role: 'student';
  filters: StudentFilters;
  onFilterChange: (filters: StudentFilters) => void;
  availableCities: string[];
  totalMatches: number;
}

interface ShopkeeperFilterBarProps {
  role: 'shopkeeper';
  filters: ShopkeeperFilters;
  onFilterChange: (filters: ShopkeeperFilters) => void;
  availableCities: string[];
  availableSkills: string[];
  totalMatches: number;
}

type FilterBarProps = StudentFilterBarProps | ShopkeeperFilterBarProps;

export const FilterBar: React.FC<FilterBarProps> = (props) => {
  if (props.role === 'student') {
    const { filters, onFilterChange, availableCities, totalMatches } = props;

    const hasActiveFilters =
      filters.searchQuery ||
      filters.city ||
      filters.category ||
      filters.helpNeeded ||
      filters.day;

    const resetFilters = () => {
      onFilterChange({
        searchQuery: '',
        city: '',
        area: '',
        category: '',
        helpNeeded: '',
        day: '',
      });
    };

    return (
      <div className="paper-card bg-white p-4 sm:p-5 mb-6 space-y-4">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) =>
                onFilterChange({ ...filters, searchQuery: e.target.value })
              }
              placeholder="Search shops by name, locality, or keyword (e.g. Balaji, Koramangala)..."
              className="paper-input w-full pl-10 pr-4 py-2.5 text-sm"
            />
            <Search className="w-4 h-4 text-ink-400 absolute left-3.5 top-3.5" />
            {filters.searchQuery && (
              <button
                onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
                className="absolute right-3 top-3 text-xs text-ink-400 hover:text-ink-700 bg-paper-200 rounded-full w-5 h-5 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              type="button"
              className="btn-secondary text-xs sm:text-sm py-2 px-3 self-end sm:self-auto shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {/* City Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-ink-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-marigold-600" />
              <span>City / Hub</span>
            </label>
            <select
              value={filters.city}
              onChange={(e) => onFilterChange({ ...filters, city: e.target.value })}
              className="paper-input w-full text-xs py-2 bg-[#FDFBF7]"
            >
              <option value="">All Cities</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Shop Category Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-ink-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-tealdeep-600" />
              <span>Shop Category</span>
            </label>
            <select
              value={filters.category}
              onChange={(e) =>
                onFilterChange({ ...filters, category: e.target.value })
              }
              className="paper-input w-full text-xs py-2 bg-[#FDFBF7]"
            >
              <option value="">All Categories</option>
              {SHOP_CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Help Needed Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-ink-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-marigold-600" />
              <span>Help Needed</span>
            </label>
            <select
              value={filters.helpNeeded}
              onChange={(e) =>
                onFilterChange({ ...filters, helpNeeded: e.target.value })
              }
              className="paper-input w-full text-xs py-2 bg-[#FDFBF7]"
            >
              <option value="">All Work Types</option>
              {WORK_TYPE_OPTIONS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          {/* Day Available Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-ink-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-tealdeep-600" />
              <span>Day Needed</span>
            </label>
            <select
              value={filters.day}
              onChange={(e) => onFilterChange({ ...filters, day: e.target.value })}
              className="paper-input w-full text-xs py-2 bg-[#FDFBF7]"
            >
              <option value="">Any Day</option>
              {DAYS_OF_WEEK.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Counter Sub-header */}
        <div className="flex items-center justify-between text-xs text-ink-500 pt-2 border-t border-paper-border">
          <span className="font-medium">
            Showing <strong className="text-ink-900 font-bold">{totalMatches}</strong> shopkeeper gigs
          </span>
          {hasActiveFilters && (
            <span className="text-[11px] text-marigold-700 bg-marigold-50 px-2 py-0.5 rounded border border-marigold-200">
              Filters applied
            </span>
          )}
        </div>
      </div>
    );
  }

  // Shopkeeper Role (Viewing Student Profiles)
  const { filters, onFilterChange, availableCities, availableSkills, totalMatches } = props;

  const hasActiveFilters =
    filters.searchQuery ||
    filters.city ||
    filters.skill ||
    filters.preferredWork ||
    filters.day;

  const resetFilters = () => {
    onFilterChange({
      searchQuery: '',
      city: '',
      area: '',
      skill: '',
      preferredWork: '',
      day: '',
    });
  };

  return (
    <div className="paper-card bg-white p-4 sm:p-5 mb-6 space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) =>
              onFilterChange({ ...filters, searchQuery: e.target.value })
            }
            placeholder="Search students by name, college, locality, or skill (e.g. Aarav, PES, Excel)..."
            className="paper-input w-full pl-10 pr-4 py-2.5 text-sm"
          />
          <Search className="w-4 h-4 text-ink-400 absolute left-3.5 top-3.5" />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
              className="absolute right-3 top-3 text-xs text-ink-400 hover:text-ink-700 bg-paper-200 rounded-full w-5 h-5 flex items-center justify-center"
            >
              ✕
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            type="button"
            className="btn-secondary text-xs sm:text-sm py-2 px-3 self-end sm:self-auto shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Dropdown Filters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        {/* City Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-ink-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-tealdeep-600" />
            <span>City / Hub</span>
          </label>
          <select
            value={filters.city}
            onChange={(e) => onFilterChange({ ...filters, city: e.target.value })}
            className="paper-input w-full text-xs py-2 bg-[#FDFBF7]"
          >
            <option value="">All Cities</option>
            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Skill Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-ink-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Tag className="w-3 h-3 text-marigold-600" />
            <span>Skill Required</span>
          </label>
          <select
            value={filters.skill}
            onChange={(e) => onFilterChange({ ...filters, skill: e.target.value })}
            className="paper-input w-full text-xs py-2 bg-[#FDFBF7]"
          >
            <option value="">All Skills</option>
            {availableSkills.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        {/* Preferred Work Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-ink-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Briefcase className="w-3 h-3 text-tealdeep-600" />
            <span>Preferred Work</span>
          </label>
          <select
            value={filters.preferredWork}
            onChange={(e) =>
              onFilterChange({ ...filters, preferredWork: e.target.value })
            }
            className="paper-input w-full text-xs py-2 bg-[#FDFBF7]"
          >
            <option value="">All Work Types</option>
            {WORK_TYPE_OPTIONS.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>

        {/* Day Available Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-ink-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-marigold-600" />
            <span>Day Available</span>
          </label>
          <select
            value={filters.day}
            onChange={(e) => onFilterChange({ ...filters, day: e.target.value })}
            className="paper-input w-full text-xs py-2 bg-[#FDFBF7]"
          >
            <option value="">Any Day</option>
            {DAYS_OF_WEEK.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Counter Sub-header */}
      <div className="flex items-center justify-between text-xs text-ink-500 pt-2 border-t border-paper-border">
        <span className="font-medium">
          Showing <strong className="text-ink-900 font-bold">{totalMatches}</strong> student talent profiles
        </span>
        {hasActiveFilters && (
          <span className="text-[11px] text-tealdeep-700 bg-tealdeep-50 px-2 py-0.5 rounded border border-tealdeep-200">
            Filters applied
          </span>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
