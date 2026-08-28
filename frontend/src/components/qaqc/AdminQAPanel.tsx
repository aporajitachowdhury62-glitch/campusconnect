import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Check,
  X,
  FileCheck,
  AlertTriangle,
  RefreshCw,
  Building2,
  ExternalLink,
  Search,
} from 'lucide-react';
import { VendorQAQC, QAStatus } from '../../types';
import { vendorService } from '../../services/vendorService';
import { VendorQABadge } from './VendorQABadge';
import { VendorQCRating } from './VendorQCRating';

interface AdminQAPanelProps {
  onVendorQAUpdated?: () => void;
}

export const AdminQAPanel: React.FC<AdminQAPanelProps> = ({ onVendorQAUpdated }) => {
  const [qaMap, setQaMap] = useState<Record<string, VendorQAQC>>({});
  const [selectedVendorId, setSelectedVendorId] = useState<string>('shp-3');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadAllQA = async () => {
    try {
      setIsLoading(true);
      const data = await vendorService.fetchAllVendorsQA();
      setQaMap(data);
      if (!data[selectedVendorId] && Object.keys(data).length > 0) {
        setSelectedVendorId(Object.keys(data)[0]);
      }
    } catch (e) {
      console.error('Failed loading QA list', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllQA();
  }, []);

  const selectedVendor = qaMap[selectedVendorId];

  const handleToggleDoc = async (docId: string, currentVerified: boolean) => {
    if (!selectedVendor) return;
    try {
      const updated = await vendorService.verifyDocument(
        selectedVendorId,
        docId,
        !currentVerified
      );
      setQaMap((prev) => ({ ...prev, [selectedVendorId]: updated }));
      showActionMsg(`Document status updated to ${!currentVerified ? 'Verified' : 'Pending'}`);
      if (onVendorQAUpdated) onVendorQAUpdated();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateStatus = async (status: QAStatus) => {
    if (!selectedVendor) return;
    try {
      const updated = await vendorService.updateQAStatus(selectedVendorId, status);
      setQaMap((prev) => ({ ...prev, [selectedVendorId]: updated }));
      showActionMsg(`Vendor QA status updated to: ${status.toUpperCase()}`);
      if (onVendorQAUpdated) onVendorQAUpdated();
    } catch (e) {
      console.error(e);
    }
  };

  const showActionMsg = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3000);
  };

  const vendorsList = Object.values(qaMap);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-paper-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-tealdeep-50 text-tealdeep-800 text-xs font-semibold mb-1 border border-tealdeep-200">
            <ShieldCheck className="w-3.5 h-3.5 text-tealdeep-700" />
            <span>Admin & Shopkeeper Verification Hub</span>
          </div>
          <h2 className="text-xl font-heading font-bold text-ink-900">
            Restaurant QA/QC Audit & Approval Engine
          </h2>
          <p className="text-xs text-ink-500 max-w-xl">
            Inspect food safety compliance, verify FSSAI numbers, review student flags, and issue official verified badges.
          </p>
        </div>

        <button
          type="button"
          onClick={loadAllQA}
          className="btn-secondary text-xs py-2 px-3 rounded-xl flex items-center gap-1.5 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Records</span>
        </button>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold animate-in fade-in">
          ✓ {actionMessage}
        </div>
      )}

      {/* Main Grid: Left Vendor List, Right Detail Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Vendor List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-bold text-ink-700 uppercase tracking-wider">
            Registered Food Vendors ({vendorsList.length})
          </h3>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {vendorsList.map((vendor) => {
              const isSelected = vendor.vendor_id === selectedVendorId;
              return (
                <button
                  key={vendor.vendor_id}
                  type="button"
                  onClick={() => setSelectedVendorId(vendor.vendor_id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-amber-50/70 border-marigold-400 shadow-sm'
                      : 'bg-white border-paper-border hover:bg-paper-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <h4 className="font-heading font-bold text-xs sm:text-sm text-ink-900 line-clamp-1">
                      {vendor.vendor_name}
                    </h4>
                    <VendorQABadge status={vendor.qa_status} size="xs" showLabel={false} />
                  </div>

                  <div className="flex items-center justify-between text-xs text-ink-500 mt-2">
                    <VendorQCRating
                      score={vendor.qc_score}
                      reviewCount={vendor.qc_review_count}
                      size="sm"
                      showLabel={false}
                    />
                    <span className="text-[11px] font-medium text-ink-600">
                      {vendor.qa_documents?.filter((d) => d.verified).length || 0}/
                      {vendor.qa_documents?.length || 4} verified
                    </span>
                  </div>

                  {vendor.qc_flags && vendor.qc_flags.length > 0 && (
                    <div className="mt-2 text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 flex items-center gap-1 font-semibold">
                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                      <span>{vendor.qc_flags.length} student flag(s)</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Vendor Audit Form */}
        <div className="lg:col-span-2">
          {selectedVendor ? (
            <div className="paper-card p-5 sm:p-6 bg-white space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-paper-border">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-heading font-bold text-lg text-ink-900">
                      {selectedVendor.vendor_name}
                    </h3>
                    <VendorQABadge status={selectedVendor.qa_status} size="sm" />
                  </div>
                  <p className="text-xs text-ink-500">
                    Vendor ID: <code>{selectedVendor.vendor_id}</code> • Category: {selectedVendor.category}
                  </p>
                </div>

                {/* Quick Status Control Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('verified')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve QA</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('rejected')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>

              {/* Document Audit Checklist */}
              <div>
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-ink-700 mb-3">
                  Document Inspection & Verification Checklist
                </h4>

                <div className="space-y-3">
                  {selectedVendor.qa_documents.map((doc) => (
                    <div
                      key={doc.id}
                      className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        doc.verified
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : 'bg-paper-50 border-paper-border'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-ink-900">
                            {doc.name}
                          </span>
                          {doc.docNumber && (
                            <code className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-paper-border font-mono text-ink-700">
                              {doc.docNumber}
                            </code>
                          )}
                        </div>
                        {doc.notes && (
                          <p className="text-xs text-ink-600 leading-normal">
                            {doc.notes}
                          </p>
                        )}
                        {doc.uploadedAt && (
                          <span className="text-[10px] text-ink-400 block">
                            Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleDoc(doc.id, doc.verified)}
                        className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          doc.verified
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                            : 'bg-white text-ink-700 border border-paper-border hover:bg-paper-200 shadow-2xs'
                        }`}
                      >
                        {doc.verified ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Verified ✓</span>
                          </>
                        ) : (
                          <>
                            <span>Mark as Verified</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* QC Flags / Reports */}
              {selectedVendor.qc_flags && selectedVendor.qc_flags.length > 0 && (
                <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 space-y-2">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Student Incident Flags & Reports</span>
                  </div>
                  {selectedVendor.qc_flags.map((flg) => (
                    <div
                      key={flg.id}
                      className="p-2.5 bg-white rounded-lg border border-rose-200 text-xs text-ink-700 flex justify-between items-start gap-2"
                    >
                      <p>{flg.reason}</p>
                      <span className="text-[10px] text-ink-400 shrink-0">
                        {new Date(flg.reported_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="paper-card p-8 text-center text-ink-500 text-sm">
              Select a vendor to inspect verification documents.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
