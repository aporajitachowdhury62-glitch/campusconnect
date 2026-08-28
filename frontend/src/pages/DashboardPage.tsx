import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  UserRole,
  StudentFilters,
  ShopkeeperFilters,
  Student,
  Shopkeeper,
  Engagement,
  Rating,
} from '../types';
import { ListingCard } from '../components/shopkeeper/ListingCard';
import { StudentCard } from '../components/student/StudentCard';
import { FilterBar } from '../components/dashboard/FilterBar';
import { EmptyState } from '../components/dashboard/EmptyState';
import { MyRequestsTable } from '../components/tracker/MyRequestsTable';
import { EmployerInbox } from '../components/tracker/EmployerInbox';
import { AdminQAPanel } from '../components/qaqc/AdminQAPanel';
import { MyRatingsView } from '../components/rating/MyRatingsView';
import { PendingRatingsBanner } from '../components/rating/PendingRatingsBanner';
import { ratingService } from '../services/ratingService';
import {
  GraduationCap,
  Store,
  Sparkles,
  MapPin,
  TrendingUp,
  Clock,
  Layers,
  Inbox,
  ShieldCheck,
  Compass,
  CheckCheck,
  UserCheck,
  Star,
  Award,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    students,
    shopkeepers,
    recentAddedId,
    currentStudentId,
    setCurrentStudentId,
    currentEmployerId,
    setCurrentEmployerId,
    studentApplicationsCount,
    employerPendingCount,
    studentPendingRatingsCount,
    employerPendingRatingsCount,
    refreshCounters,
  } = useApp();

  // Active Role Tab: 'student' vs 'shopkeeper'
  const [activeRole, setActiveRole] = useState<UserRole>('student');

  // Sub-tabs for Student View: 'gigs' | 'applications' | 'ratings'
  const [studentSubTab, setStudentSubTab] = useState<'gigs' | 'applications' | 'ratings'>('gigs');

  // Sub-tabs for Shopkeeper View: 'talent' | 'inbox' | 'ratings' | 'qa_admin'
  const [shopkeeperSubTab, setShopkeeperSubTab] = useState<'talent' | 'inbox' | 'ratings' | 'qa_admin'>('talent');

  // Pending engagements for active user
  const [pendingEngagements, setPendingEngagements] = useState<Engagement[]>([]);

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

  const loadPendingRatings = async () => {
    try {
      const activeId = activeRole === 'student' ? currentStudentId : currentEmployerId;
      const pending = await ratingService.fetchPendingRatings(activeId, activeRole);
      setPendingEngagements(pending);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadPendingRatings();
  }, [activeRole, currentStudentId, currentEmployerId]);

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
      // Search query
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
      // Search query
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

  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0];
  const currentEmployer = shopkeepers.find((s) => s.id === currentEmployerId) || shopkeepers[2];

  const handleRatingSubmitted = () => {
    loadPendingRatings();
    refreshCounters();
  };

  return (
    <main className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Hero & Role Switcher Banner */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-paper-border">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-marigold-100 text-marigold-900 border border-marigold-200 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-marigold-700" />
                <span>Hyperlocal Two-Sided Marketplace</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-heading font-bold text-ink-900 tracking-tight">
                Neighborhood Gigs & Two-Sided Trust
              </h1>
              <p className="text-sm text-ink-600 mt-1 max-w-xl">
                Students and local shopkeepers build reputation together. Track live application delivery ticks and rate completed shifts.
              </p>
            </div>

            {/* Persona Switcher for Quick Live Demo */}
            <div className="bg-white p-3 rounded-2xl border border-paper-border shadow-2xs space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-ink-400 uppercase tracking-wider">
                <UserCheck className="w-3.5 h-3.5 text-marigold-600" />
                <span>Active Demo Persona</span>
              </div>

              {activeRole === 'student' ? (
                <div className="flex items-center gap-2">
                  <span className="text-ink-600 font-medium">Student:</span>
                  <select
                    value={currentStudentId}
                    onChange={(e) => setCurrentStudentId(e.target.value)}
                    className="paper-input text-xs py-1 px-2 font-bold text-marigold-900 bg-marigold-50/50 border-marigold-300"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.collegeName.split(' ')[0]}) — {s.avg_rating || 4.8}★
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-ink-600 font-medium">Employer:</span>
                  <select
                    value={currentEmployerId}
                    onChange={(e) => setCurrentEmployerId(e.target.value)}
                    className="paper-input text-xs py-1 px-2 font-bold text-tealdeep-900 bg-tealdeep-50/50 border-tealdeep-300"
                  >
                    {shopkeepers.map((sh) => (
                      <option key={sh.id} value={sh.id}>
                        {sh.ownerName} ({sh.shopName.split(' ')[0]}) — {sh.avg_rating || 4.7}★
                      </option>
                    ))}
                  </select>
                </div>
              )}
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
                <span>I'm a shopkeeper — find talent</span>
              </button>
            </div>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="mt-5 flex items-center justify-center">
            {activeRole === 'student' ? (
              <div className="flex flex-wrap items-center justify-center gap-2 p-1 rounded-xl bg-paper-100 border border-paper-border">
                <button
                  type="button"
                  onClick={() => setStudentSubTab('gigs')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-heading font-bold transition-all ${
                    studentSubTab === 'gigs'
                      ? 'bg-white text-marigold-900 shadow-2xs border border-paper-border'
                      : 'text-ink-600 hover:text-ink-900'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 text-marigold-600" />
                  <span>Browse Gigs ({filteredListings.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStudentSubTab('applications')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-heading font-bold transition-all ${
                    studentSubTab === 'applications'
                      ? 'bg-white text-marigold-900 shadow-2xs border border-paper-border'
                      : 'text-ink-600 hover:text-ink-900'
                  }`}
                >
                  <CheckCheck className="w-3.5 h-3.5 text-tealdeep-600" />
                  <span>My Applications (Ticks)</span>
                  {studentApplicationsCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-marigold-100 text-marigold-900 text-[10px] font-bold">
                      {studentApplicationsCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStudentSubTab('ratings')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-heading font-bold transition-all ${
                    studentSubTab === 'ratings'
                      ? 'bg-white text-marigold-900 shadow-2xs border border-paper-border'
                      : 'text-ink-600 hover:text-ink-900'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>My Ratings & Gigs</span>
                  {studentPendingRatingsCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold animate-pulse">
                      {studentPendingRatingsCount} to rate
                    </span>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-2 p-1 rounded-xl bg-paper-100 border border-paper-border">
                <button
                  type="button"
                  onClick={() => setShopkeeperSubTab('talent')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-heading font-bold transition-all ${
                    shopkeeperSubTab === 'talent'
                      ? 'bg-white text-tealdeep-900 shadow-2xs border border-paper-border'
                      : 'text-ink-600 hover:text-ink-900'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5 text-tealdeep-700" />
                  <span>Talent Pool ({filteredStudents.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShopkeeperSubTab('inbox')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-heading font-bold transition-all ${
                    shopkeeperSubTab === 'inbox'
                      ? 'bg-white text-tealdeep-900 shadow-2xs border border-paper-border'
                      : 'text-ink-600 hover:text-ink-900'
                  }`}
                >
                  <Inbox className="w-3.5 h-3.5 text-tealdeep-700" />
                  <span>Applicant Inbox</span>
                  {employerPendingCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold animate-pulse">
                      {employerPendingCount} new
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShopkeeperSubTab('ratings')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-heading font-bold transition-all ${
                    shopkeeperSubTab === 'ratings'
                      ? 'bg-white text-tealdeep-900 shadow-2xs border border-paper-border'
                      : 'text-ink-600 hover:text-ink-900'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>Shop Ratings & Gigs</span>
                  {employerPendingRatingsCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold animate-pulse">
                      {employerPendingRatingsCount} to rate
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShopkeeperSubTab('qa_admin')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-heading font-bold transition-all ${
                    shopkeeperSubTab === 'qa_admin'
                      ? 'bg-white text-tealdeep-900 shadow-2xs border border-paper-border'
                      : 'text-ink-600 hover:text-ink-900'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Restaurant QA Verification</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Global Pending Ratings Nudge Banner (if user has ratings due) */}
        {((activeRole === 'student' && studentSubTab === 'gigs') ||
          (activeRole === 'shopkeeper' && shopkeeperSubTab === 'talent')) && (
          <PendingRatingsBanner
            pendingEngagements={pendingEngagements}
            currentUserId={activeRole === 'student' ? currentStudentId : currentEmployerId}
            currentUserRole={activeRole}
            onRatingSubmitted={handleRatingSubmitted}
          />
        )}

        {/* View 1: Student View */}
        {activeRole === 'student' && (
          <div>
            {studentSubTab === 'gigs' ? (
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
                        onNavigateToApplications={() => setStudentSubTab('applications')}
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
            ) : studentSubTab === 'applications' ? (
              <MyRequestsTable
                studentId={currentStudentId}
                onExploreGigs={() => setStudentSubTab('gigs')}
              />
            ) : (
              <MyRatingsView
                userId={currentStudentId}
                userName={currentStudent.name}
                userRole="student"
                onRefreshParent={handleRatingSubmitted}
              />
            )}
          </div>
        )}

        {/* View 2: Shopkeeper View */}
        {activeRole === 'shopkeeper' && (
          <div>
            {shopkeeperSubTab === 'talent' ? (
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
            ) : shopkeeperSubTab === 'inbox' ? (
              <EmployerInbox
                employerId={currentEmployerId}
                employerName={currentEmployer.ownerName}
                onRequestsUpdated={refreshCounters}
              />
            ) : shopkeeperSubTab === 'ratings' ? (
              <MyRatingsView
                userId={currentEmployerId}
                userName={currentEmployer.shopName}
                userRole="shopkeeper"
                onRefreshParent={handleRatingSubmitted}
              />
            ) : (
              <AdminQAPanel onVendorQAUpdated={refreshCounters} />
            )}
          </div>
        )}
      </div>
    </main>
  );
};
