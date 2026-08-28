import { VendorQAQC, Review, QAStatus, QADocument } from '../types';
import { INITIAL_VENDOR_QAQC, INITIAL_REVIEWS } from '../data/mockData';

// In-memory / LocalStorage backed mock storage for drop-in FastAPI transition
const STORAGE_KEY_QA = 'campusconnect_vendor_qa_v1';
const STORAGE_KEY_REVIEWS = 'campusconnect_reviews_v1';

const getStoredQA = (): Record<string, VendorQAQC> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_QA);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading QA storage', e);
  }
  return INITIAL_VENDOR_QAQC;
};

const saveStoredQA = (data: Record<string, VendorQAQC>) => {
  try {
    localStorage.setItem(STORAGE_KEY_QA, JSON.stringify(data));
  } catch (e) {
    console.error('Failed saving QA storage', e);
  }
};

const getStoredReviews = (): Review[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REVIEWS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading reviews storage', e);
  }
  return INITIAL_REVIEWS;
};

const saveStoredReviews = (data: Review[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(data));
  } catch (e) {
    console.error('Failed saving reviews storage', e);
  }
};

/**
 * Vendor QA/QC API Service
 * Note: Swap mock logic with `fetch('/api/v1/vendors/...')` once FastAPI backend is deployed.
 */
export const vendorService = {
  /**
   * Fetch QA verification checklist & status for a specific food vendor
   */
  async fetchVendorQA(vendorId: string): Promise<VendorQAQC | null> {
    await new Promise((resolve) => setTimeout(resolve, 150)); // Simulating network latency
    const allQA = getStoredQA();
    if (allQA[vendorId]) {
      return allQA[vendorId];
    }
    // Return default unverified profile if none exists
    return {
      vendor_id: vendorId,
      vendor_name: 'Food Vendor',
      category: 'Food/restaurant',
      qa_status: 'unverified',
      qa_documents: [
        {
          id: `doc-fssai-${vendorId}`,
          type: 'fssai',
          name: 'FSSAI License Certificate',
          verified: false,
          notes: 'Not yet uploaded',
        },
        {
          id: `doc-hygiene-${vendorId}`,
          type: 'hygiene',
          name: 'Hygiene & Cleanliness Audit',
          verified: false,
          notes: 'Pending inspection',
        },
        {
          id: `doc-gst-${vendorId}`,
          type: 'business_reg',
          name: 'Business Registration / GST',
          verified: false,
          notes: 'Pending documentation',
        },
        {
          id: `doc-contact-${vendorId}`,
          type: 'contact_verification',
          name: 'Contact & Phone Verification',
          verified: false,
          notes: 'Pending verification',
        },
      ],
      qc_score: 0,
      qc_review_count: 0,
      qc_flags: [],
    };
  },

  /**
   * Fetch all student reviews for a vendor
   */
  async fetchVendorReviews(vendorId: string): Promise<Review[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const allReviews = getStoredReviews();
    return allReviews.filter((r) => r.vendor_id === vendorId);
  },

  /**
   * Submit a new student review and automatically recalculate aggregate QC score
   */
  async submitReview(
    reviewData: Omit<Review, 'id' | 'created_at' | 'flagged'>
  ): Promise<{ review: Review; updatedQA: VendorQAQC }> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const allReviews = getStoredReviews();
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      created_at: new Date().toISOString(),
      flagged: false,
    };

    const updatedReviews = [newReview, ...allReviews];
    saveStoredReviews(updatedReviews);

    // Recalculate vendor QC score
    const vendorReviews = updatedReviews.filter(
      (r) => r.vendor_id === reviewData.vendor_id
    );
    const totalScore = vendorReviews.reduce((sum, r) => sum + r.rating, 0);
    const newAvg = Number((totalScore / vendorReviews.length).toFixed(1));

    const allQA = getStoredQA();
    const currentQA = allQA[reviewData.vendor_id] || (await this.fetchVendorQA(reviewData.vendor_id));
    const updatedQA: VendorQAQC = {
      ...currentQA,
      qc_score: newAvg,
      qc_review_count: vendorReviews.length,
    };

    allQA[reviewData.vendor_id] = updatedQA;
    saveStoredQA(allQA);

    return { review: newReview, updatedQA };
  },

  /**
   * Report / flag an issue for a vendor (hygiene, mismatch, safety, etc.)
   */
  async reportIssue(
    vendorId: string,
    reason: string
  ): Promise<VendorQAQC> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const allQA = getStoredQA();
    const vendorQA = allQA[vendorId] || (await this.fetchVendorQA(vendorId));

    const newFlag = {
      id: `flg-${Date.now()}`,
      reason,
      reported_at: new Date().toISOString(),
      resolved: false,
    };

    const updatedQA: VendorQAQC = {
      ...vendorQA,
      qc_flags: [newFlag, ...(vendorQA.qc_flags || [])],
    };

    allQA[vendorId] = updatedQA;
    saveStoredQA(allQA);
    return updatedQA;
  },

  /**
   * Admin: Update overall QA status (verified | pending | rejected)
   */
  async updateQAStatus(
    vendorId: string,
    status: QAStatus,
    reviewedBy: string = 'CampusConnect Admin Safety Team'
  ): Promise<VendorQAQC> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const allQA = getStoredQA();
    const vendorQA = allQA[vendorId] || (await this.fetchVendorQA(vendorId));

    const updatedQA: VendorQAQC = {
      ...vendorQA,
      qa_status: status,
      qa_verified_at: status === 'verified' ? new Date().toISOString() : undefined,
      qa_reviewed_by: reviewedBy,
    };

    allQA[vendorId] = updatedQA;
    saveStoredQA(allQA);
    return updatedQA;
  },

  /**
   * Admin: Toggle individual document verification status
   */
  async verifyDocument(
    vendorId: string,
    docId: string,
    verified: boolean,
    docNumber?: string
  ): Promise<VendorQAQC> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const allQA = getStoredQA();
    const vendorQA = allQA[vendorId] || (await this.fetchVendorQA(vendorId));

    const updatedDocs = vendorQA.qa_documents.map((doc) => {
      if (doc.id === docId) {
        return {
          ...doc,
          verified,
          docNumber: docNumber !== undefined ? docNumber : doc.docNumber,
          verifiedAt: verified ? new Date().toISOString() : undefined,
        };
      }
      return doc;
    });

    // If all essential docs are verified, auto mark as verified
    const allVerified = updatedDocs.length > 0 && updatedDocs.every((d) => d.verified);
    const newStatus: QAStatus = allVerified ? 'verified' : vendorQA.qa_status;

    const updatedQA: VendorQAQC = {
      ...vendorQA,
      qa_documents: updatedDocs,
      qa_status: newStatus,
      qa_verified_at: allVerified ? new Date().toISOString() : vendorQA.qa_verified_at,
    };

    allQA[vendorId] = updatedQA;
    saveStoredQA(allQA);
    return updatedQA;
  },

  /**
   * Fetch all QA records
   */
  async fetchAllVendorsQA(): Promise<Record<string, VendorQAQC>> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return getStoredQA();
  },
};
