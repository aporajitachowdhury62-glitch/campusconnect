import { ConnectionRequest, ConnectionStatus } from '../types';
import { INITIAL_CONNECTION_REQUESTS } from '../data/mockData';

const STORAGE_KEY_REQUESTS = 'campusconnect_connection_requests_v1';

const getStoredRequests = (): ConnectionRequest[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REQUESTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading connection requests storage', e);
  }
  return INITIAL_CONNECTION_REQUESTS;
};

const saveStoredRequests = (data: ConnectionRequest[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(data));
  } catch (e) {
    console.error('Failed saving connection requests storage', e);
  }
};

/**
 * Connection Request Tracking Service
 * Tracks delivery lifecycle (sent -> seen -> accepted / rejected / expired)
 * Note: Drop-in swap for FastAPI `/api/v1/applications/...` routes.
 */
export const connectionService = {
  /**
   * Fetch all requests sent by a student
   */
  async fetchStudentRequests(studentId: string): Promise<ConnectionRequest[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const all = getStoredRequests();
    return all.filter((r) => r.student_id === studentId);
  },

  /**
   * Fetch all requests received by an employer/shopkeeper
   */
  async fetchEmployerRequests(employerId: string): Promise<ConnectionRequest[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const all = getStoredRequests();
    return all.filter((r) => r.employer_id === employerId);
  },

  /**
   * Send a new application/message request from student to employer
   */
  async sendConnectionRequest(
    data: Omit<ConnectionRequest, 'id' | 'status' | 'sent_at'>
  ): Promise<ConnectionRequest> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const all = getStoredRequests();

    const newRequest: ConnectionRequest = {
      ...data,
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      status: 'sent',
      sent_at: new Date().toISOString(),
    };

    const updated = [newRequest, ...all];
    saveStoredRequests(updated);
    return newRequest;
  },

  /**
   * Mark request as seen when employer views it
   */
  async markRequestSeen(requestId: string): Promise<ConnectionRequest> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const all = getStoredRequests();
    let updatedItem: ConnectionRequest | null = null;

    const updated = all.map((req) => {
      if (req.id === requestId && req.status === 'sent') {
        updatedItem = {
          ...req,
          status: 'seen',
          seen_at: new Date().toISOString(),
        };
        return updatedItem;
      }
      if (req.id === requestId) {
        updatedItem = req;
      }
      return req;
    });

    if (updatedItem) {
      saveStoredRequests(updated);
      return updatedItem;
    }
    throw new Error('Request not found');
  },

  /**
   * Employer responds: Accept or Reject
   */
  async respondToRequest(
    requestId: string,
    status: 'accepted' | 'rejected',
    employerNote?: string
  ): Promise<ConnectionRequest> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const all = getStoredRequests();
    let updatedItem: ConnectionRequest | null = null;

    const updated = all.map((req) => {
      if (req.id === requestId) {
        updatedItem = {
          ...req,
          status,
          responded_at: new Date().toISOString(),
          seen_at: req.seen_at || new Date().toISOString(),
          employer_note: employerNote || req.employer_note,
        };
        return updatedItem;
      }
      return req;
    });

    if (updatedItem) {
      saveStoredRequests(updated);
      return updatedItem;
    }
    throw new Error('Request not found');
  },

  /**
   * Fetch all requests in system (for overall counts or admin view)
   */
  async fetchAllRequests(): Promise<ConnectionRequest[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return getStoredRequests();
  },
};
