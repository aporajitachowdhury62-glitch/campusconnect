export type Qualification =
  | 'Class 12/Diploma'
  | 'B.Tech/B.E.'
  | 'B.Sc/B.Com/B.A.'
  | 'M.Tech/M.Sc'
  | 'Other';

export type WorkType =
  | 'Shop/counter assistance'
  | 'Delivery/errands'
  | 'Tutoring'
  | 'Data entry/billing'
  | 'Event help'
  | 'Social media/basic design'
  | 'Other';

export type TimeOfDay =
  | 'Morning'
  | 'Afternoon'
  | 'Evening'
  | 'Weekends only';

export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export type ShopCategory =
  | 'Kirana/general store'
  | 'Electronics'
  | 'Clothing'
  | 'Food/restaurant'
  | 'Stationery'
  | 'Pharmacy'
  | 'Salon'
  | 'Other';

export interface Student {
  id: string;
  name: string;
  age: number;
  collegeName: string;
  qualification: Qualification;
  customQualification?: string;
  area: string;
  city: string;
  state: string;
  skills: string[];
  preferredWorkType: WorkType;
  customWorkType?: string;
  preferredTimeOfDay: TimeOfDay[];
  daysAvailable: DayOfWeek[];
  hoursPerDay: number;
  totalHoursPerWeek: number; // Derived: daysAvailable.length * hoursPerDay
  phone?: string;
  createdAt: string;
}

export interface Shopkeeper {
  id: string;
  shopName: string;
  ownerName: string;
  category: ShopCategory;
  customCategory?: string;
  area: string;
  city: string;
  state: string;
  helpNeeded: WorkType;
  customHelpNeeded?: string;
  skillsRequired: string[];
  daysNeeded: DayOfWeek[];
  hoursPerDay: number;
  totalHoursPerWeek: number; // Derived: daysNeeded.length * hoursPerDay
  contactNumber: string;
  payEstimate?: string;
  createdAt: string;
}

export type UserRole = 'student' | 'shopkeeper';

export interface StudentFilters {
  searchQuery: string;
  city: string;
  area: string;
  category: string;
  helpNeeded: string;
  day: string;
}

export interface ShopkeeperFilters {
  searchQuery: string;
  city: string;
  area: string;
  skill: string;
  preferredWork: string;
  day: string;
}
