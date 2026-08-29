import { Rating, Engagement, RatingSummaryData, UserRoleType } from '../types';
import { INITIAL_RATINGS, INITIAL_ENGAGEMENTS } from '../data/mockData';

const STORAGE_KEY_RATINGS = 'campusconnect_two_sided_ratings_v1';
const STORAGE_KEY_ENGAGEMENTS = 'campusconnect_engagements_v1';

// Default dummy ratings for seamless frontend rendering
const FALLBACK_DEFAULT_RATINGS: Rating[] = [
  {
    id: 'rat-fb-1',
    engagement_id: 'eng-1',
    job_title: 'Shop / Counter Assistance',
    rater_id: 'shp-1',
    rater_name: 'Subhash Rao (Kirana Store)',
    rater_role: 'shopkeeper',
    ratee_id: 'std-1',
    ratee_name: 'Aarav Sharma',
    ratee_role: 'student',
    score: 5,
    comment: 'Aarav was extremely punctual for all weekend shifts. Handled evening customer rush at the POS counter with great patience and accuracy.',
    tags: ['Punctual & On Time', 'Quick Learner', 'Polite to Customers', 'Hardworking'],
    created_at: '2026-08-24T19:30:00Z',
  },
  {
    id: 'rat-fb-2',
    engagement_id: 'eng-1',
    job_title: 'Shop / Counter Assistance',
    rater_id: 'std-1',
    rater_name: 'Aarav Sharma',
    rater_role: 'student',
    ratee_id: 'shp-1',
    ratee_name: 'Subhash Rao (Sri Venkateshwara Kirana)',
    ratee_role: 'shopkeeper',
    score: 5,
    comment: 'Mr. Subhash is a fantastic shop owner! He paid the exact agreed stipend every Sunday evening and provided snacks during breaks.',
    tags: ['Paid on Time', 'Respectful & Friendly', 'Clear Instructions', 'Free Snacks / Meals'],
    created_at: '2026-08-24T20:00:00Z',
  },
  {
    id: 'rat-fb-3',
    engagement_id: 'eng-2',
    job_title: 'Social media / basic design',
    rater_id: 'shp-3',
    rater_name: 'Tanvi Saxena (Green Leaf Cafe)',
    rater_role: 'shopkeeper',
    ratee_id: 'std-2',
    ratee_name: 'Priya Nambiar',
    ratee_role: 'student',
    score: 5,
    comment: 'Priya designed aesthetic Canva chalkboard reels for our bakery weekend special. Her turn-around time was fast and she is super creative!',
    tags: ['Hardworking', 'Quick Learner', 'Tech Savvy', 'Followed Instructions'],
    created_at: '2026-08-25T18:15:00Z',
  },
  {
    id: 'rat-fb-4',
    engagement_id: 'eng-2',
    job_title: 'Social media / basic design',
    rater_id: 'std-2',
    rater_name: 'Priya Nambiar',
    rater_role: 'student',
    ratee_id: 'shp-3',
    ratee_name: 'Tanvi Saxena (Green Leaf Organic Cafe)',
    ratee_role: 'shopkeeper',
    score: 5,
    comment: 'Wonderful workplace and warm management. The kitchen and cafe are spotless, guidelines are clear, and payout was processed immediately.',
    tags: ['Paid on Time', 'Safe Work Environment', 'Respectful & Friendly', 'Flexible Schedule'],
    created_at: '2026-08-25T19:00:00Z',
  },
  {
    id: 'rat-fb-5',
    engagement_id: 'eng-4',
    job_title: 'Prescription & Hyperlocal Delivery',
    rater_id: 'std-5',
    rater_name: 'Vikram Joshi',
    rater_role: 'student',
    ratee_id: 'shp-4',
    ratee_name: 'Dr. Suresh Kumar (MedPlus Pharmacy)',
    ratee_role: 'shopkeeper',
    score: 4.8,
    comment: 'Doctor gave extra fuel allowance on rainy days. Very professional and supportive employer.',
    tags: ['Paid on Time', 'Respectful & Friendly', 'Accurate Hours'],
    created_at: '2026-08-26T20:30:00Z',
  },
];

const getStoredRatings = (): Rating[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RATINGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed reading ratings storage', e);
  }
  return INITIAL_RATINGS && INITIAL_RATINGS.length > 0 ? INITIAL_RATINGS : FALLBACK_DEFAULT_RATINGS;
};

const saveStoredRatings = (data: Rating[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_RATINGS, JSON.stringify(data));
  } catch (e) {
    console.error('Failed saving ratings storage', e);
  }
};

const getStoredEngagements = (): Engagement[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ENGAGEMENTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed reading engagements storage', e);
  }
  return INITIAL_ENGAGEMENTS;
};

const saveStoredEngagements = (data: Engagement[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_ENGAGEMENTS, JSON.stringify(data));
  } catch (e) {
    console.error('Failed saving engagements storage', e);
  }
};

/**
 * Two-Sided Ratings & Engagements API Service
 * Drop-in swap for FastAPI routes:
 * POST /engagements/{id}/rate
 * GET  /users/{id}/ratings
 * GET  /users/{id}/ratings/summary
 * GET  /engagements/pending-ratings
 */
export const ratingService = {
  /**
   * Fetch all ratings received by a specific user (student or shopkeeper)
   */
  async fetchUserRatings(userId: string): Promise<Rating[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const all = getStoredRatings();
    const matches = all.filter((r) => r.ratee_id === userId);
    
    // If no direct matches for demo user, return general sample ratings adapted for UI
    if (matches.length === 0) {
      return all.slice(0, 3).map((r, idx) => ({
        ...r,
        id: `rat-gen-${userId}-${idx}`,
        ratee_id: userId,
      }));
    }
    return matches;
  },

  /**
   * Fetch ratings given by a user
   */
  async fetchGivenRatings(userId: string): Promise<Rating[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const all = getStoredRatings();
    return all.filter((r) => r.rater_id === userId);
  },

  /**
   * Fetch aggregate summary with average, count, 5-star distribution breakdown, and top tags
   */
  async fetchUserRatingSummary(userId: string): Promise<RatingSummaryData> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const ratings = await this.fetchUserRatings(userId);

    const breakdown: { 5: number; 4: number; 3: number; 2: number; 1: number } = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    const tagCounts: Record<string, number> = {};

    let totalScore = 0;
    ratings.forEach((r) => {
      totalScore += r.score;
      const rounded = Math.min(5, Math.max(1, Math.round(r.score))) as 1 | 2 | 3 | 4 | 5;
      breakdown[rounded] = (breakdown[rounded] || 0) + 1;

      if (r.tags) {
        r.tags.forEach((tag) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    const avg = ratings.length > 0 ? Number((totalScore / ratings.length).toFixed(1)) : 4.8;
    const count = ratings.length > 0 ? ratings.length : 8;

    // Provide default rich tags if empty
    if (Object.keys(tagCounts).length === 0) {
      tagCounts['Punctual & On Time'] = 5;
      tagCounts['Respectful & Friendly'] = 4;
      tagCounts['Paid on Time'] = 4;
      tagCounts['Quick Learner'] = 3;
    }

    const topTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    return {
      avg_rating: avg,
      rating_count: count,
      rating_breakdown: ratings.length > 0 ? breakdown : { 5: 6, 4: 2, 3: 0, 2: 0, 1: 0 },
      top_tags: topTags,
    };
  },

  /**
   * Fetch completed engagements that the active user has NOT yet rated
   */
  async fetchPendingRatings(
    userId: string,
    userRole: UserRoleType
  ): Promise<Engagement[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const engagements = getStoredEngagements();
    const isStudent = (userRole || '').toLowerCase().includes('student');

    return engagements.filter((eng) => {
      if (eng.status !== 'completed') return false;
      if (isStudent) {
        return eng.student_id === userId && !eng.has_student_rated;
      } else {
        return eng.shopkeeper_id === userId && !eng.has_shopkeeper_rated;
      }
    });
  },

  /**
   * Fetch all engagements for a user (ongoing + completed)
   */
  async fetchUserEngagements(
    userId: string,
    role: UserRoleType
  ): Promise<Engagement[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const engagements = getStoredEngagements();
    const isStudent = (role || '').toLowerCase().includes('student');
    return engagements.filter((eng) =>
      isStudent ? eng.student_id === userId : eng.shopkeeper_id === userId
    );
  },

  /**
   * Submit rating for a completed engagement
   */
  async submitRating(
    engagementId: string,
    data: Omit<Rating, 'id' | 'created_at'>
  ): Promise<{ rating: Rating; engagement: Engagement }> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const ratings = getStoredRatings();
    const engagements = getStoredEngagements();

    const newRating: Rating = {
      ...data,
      id: `rat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
    };

    const updatedRatings = [newRating, ...ratings];
    saveStoredRatings(updatedRatings);

    // Update engagement flag
    const isStudent = (data.rater_role || '').toLowerCase().includes('student');
    let updatedEng: Engagement | null = null;
    const updatedEngagements = engagements.map((eng) => {
      if (eng.id === engagementId) {
        updatedEng = {
          ...eng,
          has_student_rated: isStudent ? true : eng.has_student_rated,
          has_shopkeeper_rated: !isStudent ? true : eng.has_shopkeeper_rated,
        };
        return updatedEng;
      }
      return eng;
    });

    if (!updatedEng) {
      // Fallback if standalone rating
      updatedEng = {
        id: engagementId,
        job_id: 'job-standalone',
        job_title: data.job_title || 'Work Engagement',
        student_id: isStudent ? data.rater_id : data.ratee_id,
        student_name: isStudent ? data.rater_name : data.ratee_name,
        shopkeeper_id: !isStudent ? data.rater_id : data.ratee_id,
        shopkeeper_name: !isStudent ? data.rater_name : data.ratee_name,
        shop_name: data.job_title,
        category: 'Other',
        status: 'completed',
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        has_student_rated: isStudent,
        has_shopkeeper_rated: !isStudent,
      };
      updatedEngagements.push(updatedEng);
    }

    saveStoredEngagements(updatedEngagements);
    return { rating: newRating, engagement: updatedEng };
  },

  /**
   * Mark an ongoing engagement as completed -> unlocks rating prompt for both parties
   */
  async completeEngagement(engagementId: string): Promise<Engagement> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const engagements = getStoredEngagements();
    let updatedEng: Engagement | null = null;

    const updated = engagements.map((eng) => {
      if (eng.id === engagementId) {
        updatedEng = {
          ...eng,
          status: 'completed',
          completed_at: new Date().toISOString(),
          has_student_rated: false,
          has_shopkeeper_rated: false,
        };
        return updatedEng;
      }
      return eng;
    });

    if (updatedEng) {
      saveStoredEngagements(updated);
      return updatedEng;
    }
    throw new Error('Engagement not found');
  },
};

export default ratingService;
