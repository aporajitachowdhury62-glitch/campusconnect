export type UserRoleType = 'student' | 'shopkeeper';

export interface Rating {
  id: string;
  engagement_id: string;
  job_title: string;
  rater_id: string;
  rater_name: string;
  rater_role: UserRoleType;
  ratee_id: string;
  ratee_name: string;
  ratee_role: UserRoleType;
  score: number; // 1 to 5
  comment?: string;
  tags?: string[];
  created_at: string;
}

export type EngagementStatus = 'ongoing' | 'completed' | 'cancelled';

export interface Engagement {
  id: string;
  job_id: string;
  job_title: string;
  student_id: string;
  student_name: string;
  student_college?: string;
  student_phone?: string;
  shopkeeper_id: string;
  shopkeeper_name: string;
  shop_name: string;
  category: string;
  status: EngagementStatus;
  started_at: string;
  completed_at?: string;
  pay_rate?: string;
  shifts_completed?: number;
  has_student_rated?: boolean;
  has_shopkeeper_rated?: boolean;
}

export interface RatingSummaryData {
  avg_rating: number;
  rating_count: number;
  rating_breakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  top_tags: { tag: string; count: number }[];
}
