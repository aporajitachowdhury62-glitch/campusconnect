import React, { useState, useEffect } from 'react';
import {
  Inbox,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  MessageSquare,
  User,
  GraduationCap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Send,
  Eye,
} from 'lucide-react';
import { ConnectionRequest } from '../../types';
import { RequestStatusBadge } from './RequestStatusBadge';
import { connectionService } from '../../services/connectionService';

interface EmployerInboxProps {
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
      console.error('Failed loading employer requests', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, [employerId]);

  // Auto-mark as seen when expanded
  const handleToggleExpand = async (req: ConnectionRequest) => {
    if (expandedReqId === req.id) {
      setExpandedReqId(null);
      return;
    }

    setExpandedReqId(req.id);

    // If status is 'sent', automatically mark as 'seen'
    if (req.status === 'sent') {
      try {
        const updated = await connectionService.markRequestSeen(req.id);
        setRequests((prev) =>
          prev.map((item) => (item.id === req.id ? updated : item))
        );
        if (onRequestsUpdated) onRequestsUpdated();
      } catch (e) {
        console.error('Failed auto-marking request as seen', e);
      }
    }
  };

  const handleRespond = async (
    requestId: string,
    status: 'accepted' | 'rejected'
  ) => {
    try {
      setProcessingId(requestId);
      const note = responseNotes[requestId] || '';
      const updated = await connectionService.respondToRequest(requestId, status, note);
      setRequests((prev) =>
        prev.map((item) => (item.id === requestId ? updated : item))
      );
      if (onRequestsUpdated) onRequestsUpdated();
    } catch (e) {
      console.error('Failed responding to request', e);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (statusFilter === 'pending') return r.status === 'sent' || r.status === 'seen';
    if (statusFilter === 'accepted') return r.status === 'accepted';
    if (statusFilter === 'rejected') return r.status === 'rejected';
    return true;
  });

  const formatDate = (isoString?: string) => {
    if (!isoString) return '—';
    try {
      return new Date(isoString).toLocaleDateString('en-IN', {
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
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-paper-border shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-tealdeep-50 text-tealdeep-800 border border-tealdeep-200 text-xs font-semibold mb-1">
              <Inbox className="w-3.5 h-3.5 text-tealdeep-700" />
              <span>Shopkeeper Applicant Management</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-ink-900">
              Incoming Student Applications ({requests.length})
            </h2>
            <p className="text-xs text-ink-500">
              Review student messages, mark requests as seen, and approve candidate connections in real time.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchInbox}
            className="btn-secondary text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5 self-start md:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Inbox</span>
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-paper-border">
          {[
            { id: 'all', label: 'All Applications', count: requests.length },
            {
              id: 'pending',
              label: 'Pending Action',
              count: requests.filter((r) => r.status === 'sent' || r.status === 'seen').length,
            },
            {
              id: 'accepted',
              label: 'Accepted Candidates',
              count: requests.filter((r) => r.status === 'accepted').length,
            },
            {
              id: 'rejected',
              label: 'Declined',
              count: requests.filter((r) => r.status === 'rejected').length,
            },
          ].map((tab) => {
            const active = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
                  active
                    ? 'bg-tealdeep-800 text-white shadow-xs'
                    : 'bg-paper-100 text-ink-600 hover:bg-paper-200 border border-paper-border'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    active ? 'bg-white/20 text-white' : 'bg-paper-200 text-ink-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Applications Stream */}
      {isLoading && requests.length === 0 ? (
        <div className="paper-card p-10 text-center space-y-2 bg-white">
          <div className="w-8 h-8 border-3 border-tealdeep-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-ink-500">Loading incoming candidate messages...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="paper-card p-10 text-center bg-white space-y-2">
          <div className="w-12 h-12 rounded-xl bg-paper-100 text-ink-400 flex items-center justify-center mx-auto">
            <Inbox className="w-6 h-6" />
          </div>
          <h4 className="font-heading font-bold text-base text-ink-800">
            No Candidate Requests in this View
          </h4>
          <p className="text-xs text-ink-500 max-w-sm mx-auto">
            When students view your listings and express interest, their connection requests will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((req) => {
            const isExpanded = expandedReqId === req.id;
            const isProcessing = processingId === req.id;

            return (
              <div
                key={req.id}
                className={`paper-card p-5 bg-white transition-all ${
                  req.status === 'sent'
                    ? 'border-marigold-300 ring-2 ring-marigold-100'
                    : 'border-paper-border'
                }`}
              >
                {/* Header Summary */}
                <div
                  onClick={() => handleToggleExpand(req)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-tealdeep-50 text-tealdeep-800 border border-tealdeep-200 flex items-center justify-center font-bold text-sm shrink-0">
                      {req.student_name ? req.student_name.charAt(0) : 'S'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-heading font-bold text-base text-ink-900">
                          {req.student_name}
                        </h4>
                        {req.status === 'sent' && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                            New Unopened
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-ink-500 flex items-center gap-1.5 mt-0.5">
                        <GraduationCap className="w-3.5 h-3.5 text-ink-400" />
                        <span>{req.student_college || 'Student Talent'}</span>
                        <span>•</span>
                        <span>Applying for: <strong>{req.job_title}</strong></span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <RequestStatusBadge status={req.status} size="sm" />
                    <span className="text-ink-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </div>
                </div>

                {/* Message Snippet & Expanded Details */}
                <div className="mt-3 pt-3 border-t border-paper-border space-y-3">
                  <div className="p-3 bg-paper-50 rounded-xl border border-paper-border text-xs text-ink-800 leading-relaxed italic">
                    "{req.message}"
                  </div>

                  {isExpanded && (
                    <div className="space-y-3 animate-in fade-in pt-1">
                      {/* Student Details & Phone */}
                      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#FAF7F2] rounded-xl border border-paper-border text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-ink-500">Student Phone:</span>
                          <a
                            href={`tel:${req.student_phone || '+91 98451 22345'}`}
                            className="font-bold text-tealdeep-800 hover:underline flex items-center gap-1"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>{req.student_phone || '+91 98451 22345'}</span>
                          </a>
                        </div>

                        {req.student_skills && (
                          <div className="flex items-center gap-1">
                            <span className="text-ink-500">Skills:</span>
                            <div className="flex gap-1">
                              {req.student_skills.map((s) => (
                                <span
                                  key={s}
                                  className="text-[10px] px-1.5 py-0.2 rounded bg-white text-ink-700 border border-paper-border"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Employer Response Box */}
                      {req.status === 'sent' || req.status === 'seen' ? (
                        <div className="p-3.5 bg-paper-100/70 rounded-xl border border-paper-border space-y-2.5">
                          <label className="block text-xs font-semibold text-ink-700">
                            Optional Quick Note to Student (e.g. interview time, reporting date):
                          </label>
                          <input
                            type="text"
                            value={responseNotes[req.id] || ''}
                            onChange={(e) =>
                              setResponseNotes({ ...responseNotes, [req.id]: e.target.value })
                            }
                            placeholder="e.g. Great! Please visit our shop on Thursday 5 PM for quick walkthrough."
                            className="w-full paper-input text-xs"
                          />

                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => handleRespond(req.id, 'rejected')}
                              className="btn-secondary text-xs py-1.5 px-3 rounded-lg text-rose-700 hover:bg-rose-50 hover:border-rose-200"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Decline Application</span>
                            </button>

                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => handleRespond(req.id, 'accepted')}
                              className="btn-teal text-xs py-1.5 px-4 rounded-lg font-semibold flex items-center gap-1.5 shadow-xs"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Accept Connection Request</span>
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
