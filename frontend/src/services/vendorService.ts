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
 * Drop-in swap for FastAPI routes:
 * GET  /vendors/{id}/qa
 * GET  /vendors/{id}/reviews
 * POST /vendors/{id}/reviews
 * POST /vendors/{id}/flags
 * PUT  /admin/vendors/{id}/qa-status
 * PUT  /admin/vendors/{id}/documents/{doc_id}
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
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
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
    const currentQA = allQA[reviewData.vendor_id] || (await this.fetchVendorQA(reviewData.vendor_id)) || {
      vendor_id: reviewData.vendor_id,
      vendor_name: 'Food Vendor',
      category: 'Food/restaurant',
      qa_status: 'unverified',
      qa_documents: [],
      qc_score: 0,
      qc_review_count: 0,
      qc_flags: [],
    };
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
   * Alias for submitReview returning the review object directly
   */
  async addReview(
    reviewData: Omit<Review, 'id' | 'created_at' | 'flagged'>
  ): Promise<Review> {
    const result = await this.submitReview(reviewData);
    return result.review;
  },

  /**
   * Report / flag an issue for a vendor (hygiene, mismatch, safety, etc.)
   */
  async reportIssue(vendorId: string, reason: string): Promise<VendorQAQC> {
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
      ...(vendorQA || {
        vendor_id: vendorId,
        vendor_name: 'Food Vendor',
        category: 'Food/restaurant',
        qa_status: 'unverified',
        qa_documents: [],
        qc_score: 0,
        qc_review_count: 0,
        qc_flags: [],
      }),
      qc_flags: [newFlag, ...(vendorQA?.qc_flags || [])],
    };

    allQA[vendorId] = updatedQA;
    saveStoredQA(allQA);
    return updatedQA;
  },

  /**
   * Alias for reportIssue
   */
  async flagReview(vendorId: string, reason: string): Promise<VendorQAQC> {
    return this.reportIssue(vendorId, reason);
  },

  /**
   * Update overall vendor QA verification status (e.g. from admin panel)
   */
  async updateQAStatus(
    vendorId: string,
    status: QAStatus,
    reviewedBy: string = 'CampusConnect Quality Inspection Team'
  ): Promise<VendorQAQC> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const allQA = getStoredQA();
    const vendorQA = allQA[vendorId] || (await this.fetchVendorQA(vendorId));

    const updatedQA: VendorQAQC = {
      ...(vendorQA || {
        vendor_id: vendorId,
        vendor_name: 'Food Vendor',
        category: 'Food/restaurant',
        qa_status: 'unverified',
        qa_documents: [],
        qc_score: 0,
        qc_review_count: 0,
        qc_flags: [],
      }),
      qa_status: status,
      qa_verified_at: status === 'verified' ? new Date().toISOString() : undefined,
      qa_reviewed_by: status === 'verified' ? reviewedBy : undefined,
    };

    allQA[vendorId] = updatedQA;
    saveStoredQA(allQA);
    return updatedQA;
  },

  /**
   * Mark an individual document as verified or unverified
   */
  async verifyDocument(
    vendorId: string,
    docId: string,
    verified: boolean,
    notes?: string
  ): Promise<VendorQAQC> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const allQA = getStoredQA();
    const vendorQA = allQA[vendorId] || (await this.fetchVendorQA(vendorId));

    if (!vendorQA) throw new Error('Vendor not found');

    const updatedDocs = vendorQA.qa_documents.map((doc) => {
      if (doc.id === docId) {
        return {
          ...doc,
          verified,
          verifiedAt: verified ? new Date().toISOString() : undefined,
          notes: notes !== undefined ? notes : doc.notes,
        };
      }
      return doc;
    });

    const allVerified = updatedDocs.length > 0 && updatedDocs.every((d) => d.verified);
    const newStatus: QAStatus = allVerified ? 'verified' : vendorQA.qa_status === 'verified' ? 'pending' : vendorQA.qa_status;

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

export default vendorService;
