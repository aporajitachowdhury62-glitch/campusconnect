import { Rating, Engagement, RatingSummaryData, UserRoleType } from '../types';
import { INITIAL_RATINGS, INITIAL_ENGAGEMENTS } from '../data/mockData';

const STORAGE_KEY_RATINGS = 'campusconnect_two_sided_ratings_v1';
const STORAGE_KEY_ENGAGEMENTS = 'campusconnect_engagements_v1';

const getStoredRatings = (): Rating[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RATINGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading ratings storage', e);
  }
  return INITIAL_RATINGS;
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
    if (raw) return JSON.parse(raw);
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
    await new Promise((resolve) => setTimeout(resolve, 150));
    const all = getStoredRatings();
    return all.filter((r) => r.ratee_id === userId);
  },

  /**
   * Fetch ratings given by a user
   */
  async fetchGivenRatings(userId: string): Promise<Rating[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const all = getStoredRatings();
    return all.filter((r) => r.rater_id === userId);
  },

  /**
   * Fetch aggregate summary with average, count, 5-star distribution breakdown, and top tags
   */
  async fetchUserRatingSummary(userId: string): Promise<RatingSummaryData> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const ratings = (getStoredRatings()).filter((r) => r.ratee_id === userId);

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

    const avg = ratings.length > 0 ? Number((totalScore / ratings.length).toFixed(1)) : 0;

    const topTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    return {
      avg_rating: avg,
      rating_count: ratings.length,
      rating_breakdown: breakdown,
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
    await new Promise((resolve) => setTimeout(resolve, 150));
    const engagements = getStoredEngagements();

    return engagements.filter((eng) => {
      if (eng.status !== 'completed') return false;
      if (userRole === 'student') {
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
    await new Promise((resolve) => setTimeout(resolve, 150));
    const engagements = getStoredEngagements();
    return engagements.filter((eng) =>
      role === 'student' ? eng.student_id === userId : eng.shopkeeper_id === userId
    );
  },

  /**
   * Submit rating for a completed engagement
   */
  async submitRating(
    engagementId: string,
    data: Omit<Rating, 'id' | 'created_at'>
  ): Promise<{ rating: Rating; engagement: Engagement }> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const ratings = getStoredRatings();
    const engagements = getStoredEngagements();

    const newRating: Rating = {
      ...data,
      id: `rat-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      created_at: new Date().toISOString(),
    };

    const updatedRatings = [newRating, ...ratings];
    saveStoredRatings(updatedRatings);

    // Update engagement flag
    let updatedEng: Engagement | null = null;
    const updatedEngagements = engagements.map((eng) => {
      if (eng.id === engagementId) {
        updatedEng = {
          ...eng,
          has_student_rated:
            data.rater_role === 'student' ? true : eng.has_student_rated,
          has_shopkeeper_rated:
            data.rater_role === 'shopkeeper' ? true : eng.has_shopkeeper_rated,
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
        student_id: data.rater_role === 'student' ? data.rater_id : data.ratee_id,
        student_name: data.rater_role === 'student' ? data.rater_name : data.ratee_name,
        shopkeeper_id: data.rater_role === 'shopkeeper' ? data.rater_id : data.ratee_id,
        shopkeeper_name: data.rater_role === 'shopkeeper' ? data.rater_name : data.ratee_name,
        shop_name: data.job_title,
        category: 'Other',
        status: 'completed',
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        has_student_rated: data.rater_role === 'student',
        has_shopkeeper_rated: data.rater_role === 'shopkeeper',
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
    await new Promise((resolve) => setTimeout(resolve, 200));
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
