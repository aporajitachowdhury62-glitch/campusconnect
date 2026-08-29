import React, { useState, useEffect } from 'react';
import {
  Inbox,
  CheckCircle2,
  XCircle,
  Phone,
  MessageSquare,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Eye,
} from 'lucide-react';
import { ConnectionRequest } from '../../types';
import { RequestStatusBadge } from './RequestStatusBadge';
import { connectionService } from '../../services/connectionService';

export interface EmployerInboxProps {
  employerId?: string;
  employerName?: string;
  onRequestsUpdated?: () => void;
}

export const EmployerInbox: React.FC<EmployerInboxProps> = ({
  employerId = 'shp-3',
  employerName = 'Tanvi Saxena (Green Leaf Cafe)',
  onRequestsUpdated,
}) => {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedReqId, setExpandedReqId] = useState<string | null>(null);
  const [responseNotes, setResponseNotes] = useState<Record<string, string>>({});
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchInbox = async () => {
    try {
      setIsLoading(true);
      const data = await connectionService.fetchEmployerRequests(employerId);
      setRequests(data);
    } catch (e) {
      console.error('Failed fetching employer inbox', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, [employerId]);

  const handleToggleExpand = async (req: ConnectionRequest) => {
    if (expandedReqId === req.id) {
      setExpandedReqId(null);
      return;
    }

    setExpandedReqId(req.id);

    // Auto-mark as seen if still 'sent'
    if (req.status === 'sent') {
      try {
        const updated = await connectionService.markAsSeen(req.id);
        setRequests((prev) => prev.map((r) => (r.id === req.id ? updated : r)));
        if (onRequestsUpdated) onRequestsUpdated();
      } catch (e) {
        console.error('Failed marking request as seen', e);
      }
    }
  };

  const handleRespond = async (
    requestId: string,
    action: 'accept' | 'reject'
  ) => {
    try {
      setProcessingId(requestId);
      const note = responseNotes[requestId] || '';
      const status = action === 'accept' ? 'accepted' : 'rejected';
      const updated = await connectionService.respondToRequest(
        requestId,
        status,
        note.trim() || undefined
      );

      setRequests((prev) => prev.map((r) => (r.id === requestId ? updated : r)));
      if (onRequestsUpdated) onRequestsUpdated();
    } catch (e) {
      console.error('Failed responding to request', e);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'pending') return r.status === 'sent' || r.status === 'seen';
    return r.status === statusFilter;
  });

  const pendingCount = requests.filter((r) => r.status === 'sent' || r.status === 'seen').length;
  const acceptedCount = requests.filter((r) => r.status === 'accepted').length;

  const formatDate = (isoString?: string) => {
    if (!isoString) return '—';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header Card */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-paper-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-tealdeep-50 text-tealdeep-800 text-xs font-semibold mb-1 border border-tealdeep-200">
            <Inbox className="w-3.5 h-3.5 text-tealdeep-700" />
            <span>Employer Application Management</span>
          </div>
          <h2 className="text-xl font-heading font-bold text-ink-900">
            Candidate Inflow & Direct Inquiries
          </h2>
          <p className="text-xs text-ink-500">
            Review students who submitted applications for your shop gigs. Accept to reveal contact numbers.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>{pendingCount} Pending Decision</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <span>{acceptedCount} Hired</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 border-b border-paper-border pb-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
            statusFilter === 'all'
              ? 'bg-ink-900 text-white shadow-2xs'
              : 'bg-paper-100 text-ink-600 hover:bg-paper-200'
          }`}
        >
          All Applications ({requests.length})
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('pending')}
          className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
            statusFilter === 'pending'
              ? 'bg-ink-900 text-white shadow-2xs'
              : 'bg-paper-100 text-ink-600 hover:bg-paper-200'
          }`}
        >
          Needs Review ({pendingCount})
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('accepted')}
          className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
            statusFilter === 'accepted'
              ? 'bg-ink-900 text-white shadow-2xs'
              : 'bg-paper-100 text-ink-600 hover:bg-paper-200'
          }`}
        >
          Accepted ({acceptedCount})
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('rejected')}
          className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
            statusFilter === 'rejected'
              ? 'bg-ink-900 text-white shadow-2xs'
              : 'bg-paper-100 text-ink-600 hover:bg-paper-200'
          }`}
        >
          Declined ({requests.filter((r) => r.status === 'rejected').length})
        </button>
      </div>

      {/* List Feed */}
      {isLoading ? (
        <div className="py-12 text-center space-y-2">
          <div className="w-8 h-8 border-3 border-tealdeep-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-ink-500">Loading student applications...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="paper-card p-12 text-center bg-white border border-paper-border space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-paper-200 text-ink-400 flex items-center justify-center mx-auto mb-2">
            <Inbox className="w-6 h-6" />
          </div>
          <h4 className="font-heading font-bold text-base text-ink-800">
            No applications match this filter
          </h4>
          <p className="text-xs text-ink-500 max-w-sm mx-auto">
            New student inquiries from nearby college campuses will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((req) => {
            const isExpanded = expandedReqId === req.id;
            const isPending = req.status === 'sent' || req.status === 'seen';
            const isProcessing = processingId === req.id;

            return (
              <div
                key={req.id}
                className={`paper-card p-4 sm:p-5 bg-white border transition-all rounded-2xl ${
                  isPending
                    ? 'border-marigold-300 shadow-warm-sm'
                    : 'border-paper-border opacity-95'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Bar: Student Name, College, Applied Position, Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-tealdeep-50 text-tealdeep-900 border border-tealdeep-200 flex items-center justify-center font-heading font-bold text-sm shrink-0">
                        {req.student_name.charAt(0)}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-bold text-sm sm:text-base text-ink-900">
                            {req.student_name}
                          </h4>
                          {req.status === 'sent' && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-marigold-100 text-marigold-900 border border-marigold-300 animate-pulse">
                              New
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-ink-500 flex-wrap">
                          {req.student_college && (
                            <span className="flex items-center gap-1">
                              <GraduationCap className="w-3 h-3 text-ink-400" />
                              {req.student_college}
                            </span>
                          )}
                          <span>•</span>
                          <span>Position: <strong>{req.job_title}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <RequestStatusBadge status={req.status} size="sm" />
                      <button
                        type="button"
                        onClick={() => handleToggleExpand(req)}
                        className="p-1.5 rounded-lg border border-paper-border hover:bg-paper-100 text-ink-600 transition-colors"
                        title={isExpanded ? 'Collapse application' : 'Inspect note & respond'}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Intro Message Snippet */}
                  <div className="p-3 rounded-xl bg-paper-50 border border-paper-border text-xs space-y-1">
                    <div className="flex items-center justify-between text-ink-400 text-[11px]">
                      <span className="flex items-center gap-1 font-medium text-ink-600">
                        <MessageSquare className="w-3 h-3 text-marigold-600" />
                        Candidate Note:
                      </span>
                      <span>Received {formatDate(req.sent_at)}</span>
                    </div>
                    <p className="text-ink-800 leading-relaxed italic">
                      "{req.message}"
                    </p>
                  </div>

                  {/* Expanded Detail Panel & Action Decision Box */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-paper-border space-y-4 animate-in fade-in">
                      {/* Candidate Skills if provided */}
                      {req.student_skills && req.student_skills.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[11px] font-semibold text-ink-500 uppercase tracking-wider block">
                            Candidate Tagged Skills:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {req.student_skills.map((sk) => (
                              <span
                                key={sk}
                                className="px-2 py-0.5 rounded-md text-xs bg-paper-100 text-ink-700 border border-paper-border"
                              >
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Contact Reveal on Acceptance */}
                      {req.status === 'accepted' && req.student_phone && (
                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-emerald-700" />
                            <span className="text-emerald-950 font-medium">
                              Student Direct Phone:
                            </span>
                            <a
                              href={`tel:${req.student_phone}`}
                              className="font-bold text-emerald-800 underline"
                            >
                              {req.student_phone}
                            </a>
                          </div>
                          <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-semibold">
                            Unlocked & Ready for Shift
                          </span>
                        </div>
                      )}

                      {/* Decision Recording Box */}
                      {isPending ? (
                        <div className="p-3.5 rounded-xl bg-paper-100 border border-paper-border space-y-3">
                          <div>
                            <label className="block text-xs font-semibold text-ink-800 mb-1">
                              Response Note for Student (Optional instructions or meeting time):
                            </label>
                            <input
                              type="text"
                              value={responseNotes[req.id] || ''}
                              onChange={(e) =>
                                setResponseNotes({
                                  ...responseNotes,
                                  [req.id]: e.target.value,
                                })
                              }
                              placeholder="e.g. Welcome aboard! Come over Friday 5 PM with your ID card."
                              className="input-field text-xs bg-white"
                            />
                          </div>

                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => handleRespond(req.id, 'reject')}
                              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Decline</span>
                            </button>

                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => handleRespond(req.id, 'accept')}
                              className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-2xs"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{isProcessing ? 'Saving...' : 'Accept Candidate'}</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-paper-50 border border-paper-border flex items-center justify-between text-xs">
                          <span className="text-ink-600">
                            Decision recorded on {formatDate(req.responded_at)}:
                          </span>
                          <span className="font-bold">
                            {req.status === 'accepted' ? (
                              <span className="text-emerald-700">✓ Accepted Candidate</span>
                            ) : (
                              <span className="text-rose-700">✕ Declined</span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EmployerInbox;
