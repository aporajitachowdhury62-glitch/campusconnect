export type QAStatus = 'verified' | 'pending' | 'rejected' | 'unverified';

export type QADocumentType =
  | 'fssai'
  | 'hygiene'
  | 'business_reg'
  | 'contact_verification';

export interface QADocument {
  id: string;
  type: QADocumentType;
  name: string;
  docNumber?: string;
  verified: boolean;
  uploadedAt?: string;
  verifiedAt?: string;
  fileUrl?: string;
  notes?: string;
}

export interface Review {
  id: string;
  vendor_id: string;
  user_id: string;
  user_name?: string;
  user_college?: string;
  rating: number; // 1 to 5
  comment: string;
  tags?: string[];
  photo_url?: string;
  created_at: string;
  flagged: boolean;
  flag_reason?: string;
}

export interface VendorQAQC {
  vendor_id: string;
  vendor_name: string;
  category: string;
  qa_status: QAStatus;
  qa_verified_at?: string;
  qa_reviewed_by?: string;
  qa_documents: QADocument[];
  qc_score: number; // e.g. 4.2
  qc_review_count: number;
  qc_flags: {
    id: string;
    reason: string;
    reported_at: string;
    resolved: boolean;
  }[];
}

export type QAQCRole =
  | 'Lead Inspector'
  | 'Food Safety Officer'
  | 'Hygiene Auditor'
  | 'Community Moderator'
  | 'Admin'
  | 'QAC'
  | 'qac';

export interface QAQCTask {
  id: string;
  vendorId: string;
  vendorName: string;
  category: string;
  taskType: 'document_verification' | 'hygiene_audit' | 'flag_investigation' | 'spot_check';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  assignedTo?: string;
  assignedRole?: QAQCRole;
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
  score?: number;
  notes?: string;
}
