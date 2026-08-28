export type ConnectionStatus =
  | 'sent'
  | 'seen'
  | 'accepted'
  | 'rejected'
  | 'expired';

export interface ConnectionRequest {
  id: string;
  student_id: string;
  student_name: string;
  student_college?: string;
  student_phone?: string;
  student_skills?: string[];
  employer_id: string;
  employer_name: string;
  shop_name: string;
  job_id: string;
  job_title: string;
  status: ConnectionStatus;
  sent_at: string;
  seen_at?: string;
  responded_at?: string;
  message: string;
  employer_note?: string;
}
