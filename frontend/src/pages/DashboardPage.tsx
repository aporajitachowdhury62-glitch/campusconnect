import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  UserRole,
  StudentFilters,
  ShopkeeperFilters,
  Student,
  Shopkeeper,
} from '../types';
import { ListingCard } from '../components/shopkeeper/ListingCard';
import { StudentCard } from '../components/student/StudentCard';
import { FilterBar } from '../components/dashboard/FilterBar';
import { EmptyState } from '../components/dashboard/EmptyState';
import {
  GraduationCap,
  Store,
  Sparkles,
  MapPin,
  TrendingUp,
  Clock,
  Layers,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { students, shopkeepers, recentAddedId } = useApp();

  // Active Role Tab: 'student' (browses shopkeeper gigs) vs 'shopkeeper' (browses student profiles)
  const [activeRole, setActiveRole] = useState<UserRole>('student');

  // Student Filter State
  const [studentFilters, setStudentFilters] = useState<StudentFilters>({
    searchQuery: '',
    city: '',
    area: '',
    category: '',
    helpNeeded: '',
    day: '',
  });

  // Shopkeeper Filter State
  const [shopkeeperFilters, setShopkeeperFilters] = useState<ShopkeeperFilters>({
    searchQuery: '',
    city: '',
    area: '',
    skill: '',
    preferredWork: '',
    day: '',
  });

  // Extract unique cities & skills from current in-memory lists
  const availableCities = useMemo(() => {
    const citiesSet = new Set<string>();
    students.forEach((s) => s.city && citiesSet.add(s.city));
    shopkeepers.forEach((sh) => sh.city && citiesSet.add(sh.city));
    return Array.from(citiesSet).sort();
  }, [students, shopkeepers]);

  const availableSkills = useMemo(() => {
    const skillsSet = new Set<string>();
    students.forEach((s) => s.skills?.forEach((sk) => skillsSet.add(sk)));
    return Array.from(skillsSet).sort();
  }, [students]);

  // Filtered Shopkeeper Listings (for Student View)
  const filteredListings = useMemo(() => {
    return shopkeepers.filter((item) => {
      // Search query (shopName, area, city, ownerName, helpNeeded)
      if (studentFilters.searchQuery.trim()) {
        const query = studentFilters.searchQuery.toLowerCase();
        const matchesName = item.shopName.toLowerCase().includes(query);
        const matchesArea = item.area.toLowerCase().includes(query);
        const matchesCity = item.city.toLowerCase().includes(query);
        const matchesOwner = item.ownerName.toLowerCase().includes(query);
        const matchesHelp = item.helpNeeded.toLowerCase().includes(query);
        const matchesSkills = item.skillsRequired.some((s) =>
          s.toLowerCase().includes(query)
        );
        if (
          !matchesName &&
          !matchesArea &&
          !matchesCity &&
          !matchesOwner &&
          !matchesHelp &&
          !matchesSkills
        ) {
          return false;
        }
      }

      // City filter
      if (studentFilters.city && item.city !== studentFilters.city) {
        return false;
      }

      // Category filter
      if (studentFilters.category && item.category !== studentFilters.category) {
        return false;
      }

      // Help needed filter
      if (
        studentFilters.helpNeeded &&
        item.helpNeeded !== studentFilters.helpNeeded
      ) {
        return false;
      }

      // Day filter
      if (
        studentFilters.day &&
        !item.daysNeeded.includes(studentFilters.day as any)
      ) {
        return false;
      }

      return true;
    });
  }, [shopkeepers, studentFilters]);

  // Filtered Students (for Shopkeeper View)
  const filteredStudents = useMemo(() => {
    return students.filter((item) => {
      // Search query (name, collegeName, area, city, skills, preferredWorkType)
      if (shopkeeperFilters.searchQuery.trim()) {
        const query = shopkeeperFilters.searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesCollege = item.collegeName.toLowerCase().includes(query);
        const matchesArea = item.area.toLowerCase().includes(query);
        const matchesCity = item.city.toLowerCase().includes(query);
        const matchesWork = item.preferredWorkType.toLowerCase().includes(query);
        const matchesSkills = item.skills.some((s) =>
          s.toLowerCase().includes(query)
        );
        if (
          !matchesName &&
          !matchesCollege &&
          !matchesArea &&
          !matchesCity &&
          !matchesWork &&
          !matchesSkills
        ) {
          return false;
        }
      }

      // City filter
      if (shopkeeperFilters.city && item.city !== shopkeeperFilters.city) {
        return false;
      }

      // Skill filter
      if (
        shopkeeperFilters.skill &&
        !item.skills.some(
          (s) => s.toLowerCase() === shopkeeperFilters.skill.toLowerCase()
        )
      ) {
        return false;
      }

      // Preferred Work filter
      if (
        shopkeeperFilters.preferredWork &&
        item.preferredWorkType !== shopkeeperFilters.preferredWork
      ) {
        return false;
      }

      // Day filter
      if (
        shopkeeperFilters.day &&
        !item.daysAvailable.includes(shopkeeperFilters.day as any)
      ) {
        return false;
      }

      return true;
    });
  }, [students, shopkeeperFilters]);

  return (
    <main className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Hero & Role Switcher Banner */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-paper-border">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-marigold-100 text-marigold-900 border border-marigold-200 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-marigold-700" />
                <span>Hyperlocal Matching Engine</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-heading font-bold text-ink-900 tracking-tight">
                Neighborhood Gigs & Student Talent
              </h1>
              <p className="text-sm text-ink-600 mt-1 max-w-xl">
                Browse nearby shops offering flexible shifts, or discover energetic college talent ready to assist your local business.
              </p>
            </div>

            {/* In-Memory Session Stats Pill Box */}
            <div className="flex items-center gap-2 sm:gap-3 self-start md:self-auto bg-white p-2 rounded-2xl border border-paper-border shadow-xs">
              <div className="px-3 py-1.5 rounded-xl bg-paper-100 border border-paper-border text-center">
                <span className="text-[10px] uppercase font-bold text-ink-400 block">
                  Active Gigs
                </span>
                <span className="text-base font-heading font-bold text-marigold-700">
                  {shopkeepers.length}
                </span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-paper-100 border border-paper-border text-center">
                <span className="text-[10px] uppercase font-bold text-ink-400 block">
                  Talent Pool
                </span>
                <span className="text-base font-heading font-bold text-tealdeep-800">
                  {students.length}
                </span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-paper-100 border border-paper-border text-center hidden sm:block">
                <span className="text-[10px] uppercase font-bold text-ink-400 block">
                  Local Hubs
                </span>
                <span className="text-base font-heading font-bold text-ink-800">
                  {availableCities.length}
                </span>
              </div>
            </div>
          </div>

          {/* Primary View Toggle: I'm a student vs I'm a shopkeeper */}
          <div className="mt-6 flex justify-center">
            <div className="inline-flex p-1.5 rounded-2xl bg-paper-200/90 border border-paper-border shadow-inner max-w-xl w-full">
              <button
                type="button"
                onClick={() => setActiveRole('student')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-heading font-semibold text-sm transition-all ${
                  activeRole === 'student'
                    ? 'bg-white text-marigold-900 shadow-warm-sm border border-paper-border scale-[1.01]'
                    : 'text-ink-600 hover:text-ink-900 hover:bg-white/50'
                }`}
              >
                <GraduationCap
                  className={`w-4 h-4 ${
                    activeRole === 'student'
                      ? 'text-marigold-600'
                      : 'text-ink-400'
                  }`}
                />
                <span>I'm a student — find work</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveRole('shopkeeper')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-heading font-semibold text-sm transition-all ${
                  activeRole === 'shopkeeper'
                    ? 'bg-white text-tealdeep-900 shadow-warm-sm border border-paper-border scale-[1.01]'
                    : 'text-ink-600 hover:text-ink-900 hover:bg-white/50'
                }`}
              >
                <Store
                  className={`w-4 h-4 ${
                    activeRole === 'shopkeeper'
                      ? 'text-tealdeep-700'
                      : 'text-ink-400'
                  }`}
                />
                <span>I'm a shopkeeper — find students</span>
              </button>
            </div>
          </div>
        </div>

        {/* View 1: Student View (browsing Shopkeeper listings) */}
        {activeRole === 'student' && (
          <div>
            <FilterBar
              role="student"
              filters={studentFilters}
              onFilterChange={setStudentFilters}
              availableCities={availableCities}
              totalMatches={filteredListings.length}
            />

            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    isRecent={recentAddedId === listing.id}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                role="student"
                onResetFilters={() =>
                  setStudentFilters({
                    searchQuery: '',
                    city: '',
                    area: '',
                    category: '',
                    helpNeeded: '',
                    day: '',
                  })
                }
              />
            )}
          </div>
        )}

        {/* View 2: Shopkeeper View (browsing Student profiles) */}
        {activeRole === 'shopkeeper' && (
          <div>
            <FilterBar
              role="shopkeeper"
              filters={shopkeeperFilters}
              onFilterChange={setShopkeeperFilters}
              availableCities={availableCities}
              availableSkills={availableSkills}
              totalMatches={filteredStudents.length}
            />

            {filteredStudents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredStudents.map((student) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    isRecent={recentAddedId === student.id}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                role="shopkeeper"
                onResetFilters={() =>
                  setShopkeeperFilters({
                    searchQuery: '',
                    city: '',
                    area: '',
                    skill: '',
                    preferredWork: '',
                    day: '',
                  })
                }
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
};
