import React, { useState, useEffect } from 'react';
import {
  Clock,
  RefreshCw,
  Search,
  CheckCircle2,
  Phone,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  Radio,
  Sparkles,
  Inbox,
} from 'lucide-react';
import { ConnectionRequest } from '../../types';
import { RequestStatusBadge } from './RequestStatusBadge';
import { connectionService } from '../../services/connectionService';
import { Modal } from '../common/Modal';

export interface MyRequestsTableProps {
  studentId?: string;
  onExploreGigs?: () => void;
}

export const MyRequestsTable: React.FC<MyRequestsTableProps> = ({
  studentId = 'std-1',
  onExploreGigs,
}) => {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPollingActive, setIsPollingActive] = useState<boolean>(true);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<ConnectionRequest | null>(null);

  const fetchRequests = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const data = await connectionService.fetchStudentRequests(studentId);
      setRequests(data);
      setLastRefreshedAt(new Date());
    } catch (e) {
      console.error('Failed fetching student connection requests', e);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(false);
  }, [studentId]);

  // Real-time polling every 5 seconds
  useEffect(() => {
    if (!isPollingActive) return;

    const interval = setInterval(() => {
      fetchRequests(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [studentId, isPollingActive]);

  const filteredRequests = requests.filter((req: ConnectionRequest) => {
    if (statusFilter !== 'all' && req.status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchShop = req.shop_name.toLowerCase().includes(q);
      const matchEmployer = req.employer_name.toLowerCase().includes(q);
      const matchJob = req.job_title.toLowerCase().includes(q);
      const matchMsg = req.message.toLowerCase().includes(q);
      return matchShop || matchEmployer || matchJob || matchMsg;
    }
    return true;
  });

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
    <div className="space-y-5">
      {/* Top Controls & Status Ticker */}
      <div className="bg-white p-5 rounded-2xl border border-paper-border shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-marigold-50 text-marigold-900 border border-marigold-200 text-xs font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-marigold-700" />
              <span>Real-Time WhatsApp-Style Delivery Ticks</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-ink-900">
              My Applications & Connection Requests
            </h2>
            <p className="text-xs text-ink-500">
              Track the exact live status of your job applications sent to local shopkeepers and food vendors.
            </p>
          </div>

          {/* Polling Controller */}
          <div className="flex items-center gap-3 self-start md:self-auto bg-paper-100 p-2 rounded-xl border border-paper-border text-xs">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isPollingActive ? 'bg-emerald-500 animate-pulse' : 'bg-ink-300'
                }`}
              />
              <span className="font-semibold text-ink-700">
                {isPollingActive ? 'Live Sync Active (5s)' : 'Live Sync Paused'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => fetchRequests(false)}
              className="p-1.5 rounded-lg bg-white border border-paper-border text-ink-600 hover:text-ink-900 shadow-2xs hover:bg-paper-50"
              title="Manual refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => setIsPollingActive(!isPollingActive)}
              className="text-[11px] text-marigold-800 hover:underline font-bold"
            >
              {isPollingActive ? 'Pause' : 'Resume'}
            </button>
          </div>
        </div>

        {/* Search & Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-paper-border">
          {/* Status Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {[
              { id: 'all', label: 'All Requests', count: requests.length },
              {
                id: 'sent',
                label: 'Sent (Single Tick)',
                count: requests.filter((r: ConnectionRequest) => r.status === 'sent').length,
              },
              {
                id: 'seen',
                label: 'Seen (Double Tick)',
                count: requests.filter((r: ConnectionRequest) => r.status === 'seen').length,
              },
              {
                id: 'accepted',
                label: 'Accepted',
                count: requests.filter((r: ConnectionRequest) => r.status === 'accepted').length,
              },
              {
                id: 'rejected',
                label: 'Declined',
                count: requests.filter((r: ConnectionRequest) => r.status === 'rejected').length,
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
                      ? 'bg-ink-900 text-white shadow-xs'
                      : 'bg-paper-100 text-ink-600 hover:bg-paper-200 border border-paper-border'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      active ? 'bg-white/20 text-white' : 'bg-paper-300/80 text-ink-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search employer, job..."
              className="w-full paper-input pl-9 text-xs py-1.5"
            />
          </div>
        </div>
      </div>

      {/* Requests Table / Card List */}
      {isLoading && requests.length === 0 ? (
        <div className="paper-card p-12 text-center space-y-3 bg-white">
          <div className="w-8 h-8 border-3 border-marigold-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-heading font-semibold text-ink-700">
            Syncing your application statuses...
          </p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="paper-card p-12 text-center bg-white space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-marigold-50 text-marigold-700 border border-marigold-200 flex items-center justify-center mx-auto shadow-sm">
            <Inbox className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-heading font-bold text-ink-900">
              No Applications Found
            </h3>
            <p className="text-xs text-ink-500">
              {statusFilter !== 'all' || searchQuery
                ? 'No requests match your current search/filter settings.'
                : "You haven't sent any connection requests or gig applications yet."}
            </p>
          </div>
          {onExploreGigs && (
            <button
              type="button"
              onClick={onExploreGigs}
              className="btn-primary text-xs py-2.5 px-5 rounded-xl font-semibold inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Neighborhood Gigs</span>
            </button>
          )}
        </div>
      ) : (
        <div className="paper-card overflow-hidden bg-white shadow-2xs">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs text-ink-700">
              <thead className="bg-paper-100/80 border-b border-paper-border text-[11px] uppercase tracking-wider text-ink-500 font-bold">
                <tr>
                  <th className="py-3.5 px-4">Employer & Shop</th>
                  <th className="py-3.5 px-4">Job Role</th>
                  <th className="py-3.5 px-4">Delivery Status</th>
                  <th className="py-3.5 px-4">Sent On</th>
                  <th className="py-3.5 px-4">Last Activity</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-border">
                {filteredRequests.map((req: ConnectionRequest) => (
                  <tr
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className="hover:bg-paper-50 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-heading font-bold text-sm text-ink-900 group-hover:text-marigold-700 transition-colors">
                        {req.shop_name}
                      </div>
                      <div className="text-[11px] text-ink-500">
                        Owner: {req.employer_name}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-ink-900 block">
                        {req.job_title}
                      </span>
                      <span className="text-[11px] text-ink-400 italic line-clamp-1">
                        "{req.message}"
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <RequestStatusBadge status={req.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-ink-600">
                      {formatDate(req.sent_at)}
                    </td>

                    <td className="py-3.5 px-4 text-ink-600">
                      {req.responded_at ? (
                        <span className="text-emerald-700 font-medium">
                          Responded {formatDate(req.responded_at)}
                        </span>
                      ) : req.seen_at ? (
                        <span className="text-sky-700 font-medium">
                          Seen {formatDate(req.seen_at)}
                        </span>
                      ) : (
                        <span className="text-ink-400">Awaiting shopkeeper open</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRequest(req);
                        }}
                        className="p-1.5 rounded-lg border border-paper-border hover:bg-paper-200 text-ink-600 transition-colors"
                        title="View Application Details"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Feed View */}
          <div className="md:hidden divide-y divide-paper-border">
            {filteredRequests.map((req: ConnectionRequest) => (
              <div
                key={req.id}
                onClick={() => setSelectedRequest(req)}
                className="p-4 space-y-2.5 active:bg-paper-50 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-heading font-bold text-sm text-ink-900">
                      {req.shop_name}
                    </h4>
                    <p className="text-xs text-ink-500 font-medium">
                      {req.job_title}
                    </p>
                  </div>
                  <RequestStatusBadge status={req.status} size="xs" />
                </div>

                <p className="text-xs text-ink-600 bg-paper-50 p-2.5 rounded-xl border border-paper-border italic line-clamp-2">
                  "{req.message}"
                </p>

                <div className="flex items-center justify-between text-[11px] text-ink-400 pt-1">
                  <span>Sent {formatDate(req.sent_at)}</span>
                  <span className="flex items-center gap-1 font-semibold text-marigold-800">
                    <span>Inspect</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedRequest && (
        <Modal
          isOpen={Boolean(selectedRequest)}
          onClose={() => setSelectedRequest(null)}
          title={selectedRequest.shop_name}
          subtitle={`Position: ${selectedRequest.job_title} • Owner: ${selectedRequest.employer_name}`}
        >
          <div className="space-y-4 text-xs">
            {/* Status Highlight Banner */}
            <div className="p-3.5 rounded-xl bg-paper-100 border border-paper-border flex items-center justify-between">
              <span className="font-semibold text-ink-700">Application State:</span>
              <RequestStatusBadge status={selectedRequest.status} size="md" />
            </div>

            {/* Timeline info */}
            <div className="space-y-2 p-3 bg-white rounded-xl border border-paper-border">
              <span className="font-bold text-[11px] uppercase tracking-wider text-ink-400 block">
                Lifecycle Timeline
              </span>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-ink-500">1. Dispatched:</span>
                  <span className="font-medium text-ink-800">
                    {formatDate(selectedRequest.sent_at)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-500">2. Viewed by Employer:</span>
                  <span className="font-medium text-ink-800">
                    {selectedRequest.seen_at ? formatDate(selectedRequest.seen_at) : 'Not opened yet'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-500">3. Final Decision:</span>
                  <span className="font-medium text-ink-800">
                    {selectedRequest.responded_at ? formatDate(selectedRequest.responded_at) : 'Pending response'}
                  </span>
                </div>
              </div>
            </div>

            {/* Message Sent */}
            <div className="space-y-1">
              <label className="font-bold text-[11px] uppercase tracking-wider text-ink-500">
                Your Intro Message:
              </label>
              <div className="p-3 rounded-xl bg-paper-50 border border-paper-border text-ink-800 italic leading-relaxed">
                "{selectedRequest.message}"
              </div>
            </div>

            {/* Employer Note if exists */}
            {selectedRequest.employer_note && (
              <div className="space-y-1 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <label className="font-bold text-[11px] uppercase tracking-wider text-emerald-900 block">
                  Employer Response Note:
                </label>
                <p className="text-emerald-950 font-medium">
                  "{selectedRequest.employer_note}"
                </p>
              </div>
            )}

            {/* Status description explanation */}
            <div className="p-3 rounded-xl bg-paper-50 border border-paper-border">
              {selectedRequest.status === 'sent' && (
                <p className="text-xs text-ink-600">
                  ✓ <strong>Single Tick:</strong> Your message has been delivered to the shopkeeper's inbox. When they open it, it will transition to Seen (Double Tick).
                </p>
              )}
              {selectedRequest.status === 'seen' && (
                <p className="text-xs text-sky-800">
                  ✓✓ <strong>Double Tick:</strong> The shopkeeper has opened and reviewed your profile. Awaiting their response decision.
                </p>
              )}
              {selectedRequest.status === 'accepted' && (
                <p className="text-xs text-emerald-800">
                  ✓ <strong>Accepted:</strong> Congratulations! The shopkeeper approved your connection. You can now coordinate shifts directly.
                </p>
              )}
              {selectedRequest.status === 'rejected' && (
                <p className="text-xs text-rose-800">
                  ✕ <strong>Declined:</strong> This gig was filled or declined. Check out other available gigs in your neighborhood!
                </p>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyRequestsTable;
