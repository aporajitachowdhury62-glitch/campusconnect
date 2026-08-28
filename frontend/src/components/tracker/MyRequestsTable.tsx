import React, { useState, useEffect } from 'react';
import {
  Clock,
  RefreshCw,
  Search,
  CheckCircle2,
  Phone,
  MessageSquare,
  Building2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Inbox,
  Filter,
  Radio,
} from 'lucide-react';
import { ConnectionRequest, ConnectionStatus } from '../../types';
import { RequestStatusBadge } from './RequestStatusBadge';
import { connectionService } from '../../services/connectionService';
import { Modal } from '../common/Modal';

interface MyRequestsTableProps {
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

  // Initial fetch
  useEffect(() => {
    fetchRequests();
  }, [studentId]);

  // Real-time polling every 5 seconds
  useEffect(() => {
    if (!isPollingActive) return;

    const interval = setInterval(() => {
      fetchRequests(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [studentId, isPollingActive]);

  const filteredRequests = requests.filter((req) => {
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
                count: requests.filter((r) => r.status === 'sent').length,
              },
              {
                id: 'seen',
                label: 'Seen (Double Tick)',
                count: requests.filter((r) => r.status === 'seen').length,
              },
              {
                id: 'accepted',
                label: 'Accepted',
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
                      ? 'bg-ink-900 text-white shadow-xs'
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

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-ink-400 absolute left-3 top-2.5" />
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
                {filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-amber-50/40 transition-colors group cursor-pointer"
                    onClick={() => setSelectedRequest(req)}
                  >
                    <td className="py-4 px-4">
                      <div>
                        <span className="font-heading font-bold text-sm text-ink-900 block group-hover:text-marigold-700">
                          {req.shop_name}
                        </span>
                        <span className="text-[11px] text-ink-500">
                          Contact: {req.employer_name}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-semibold text-ink-800 bg-paper-100 px-2 py-0.5 rounded border border-paper-border">
                        {req.job_title}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <RequestStatusBadge status={req.status} size="sm" />
                    </td>

                    <td className="py-4 px-4 text-ink-600 font-medium">
                      {formatDate(req.sent_at)}
                    </td>

                    <td className="py-4 px-4 text-ink-600">
                      {req.responded_at ? (
                        <span className="text-emerald-700 font-semibold">
                          Responded {formatDate(req.responded_at)}
                        </span>
                      ) : req.seen_at ? (
                        <span className="text-sky-700 font-medium">
                          Seen {formatDate(req.seen_at)}
                        </span>
                      ) : (
                        <span className="text-ink-400">Awaiting shopkeeper</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRequest(req);
                        }}
                        className="btn-secondary text-xs py-1.5 px-3 rounded-lg font-semibold inline-flex items-center gap-1 group-hover:bg-marigold-100 group-hover:text-marigold-900 group-hover:border-marigold-300"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden divide-y divide-paper-border">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                onClick={() => setSelectedRequest(req)}
                className="p-4 space-y-3 hover:bg-paper-50 active:bg-paper-100"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-heading font-bold text-base text-ink-900">
                      {req.shop_name}
                    </h4>
                    <p className="text-xs text-ink-500">
                      Contact: {req.employer_name} • {req.job_title}
                    </p>
                  </div>
                  <RequestStatusBadge status={req.status} size="sm" />
                </div>

                <div className="flex items-center justify-between text-xs text-ink-500 pt-1 border-t border-paper-border">
                  <span>Sent: {formatDate(req.sent_at)}</span>
                  <span className="font-semibold text-marigold-700">View message & notes →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Request Detail Modal */}
      {selectedRequest && (
        <Modal
          isOpen={Boolean(selectedRequest)}
          onClose={() => setSelectedRequest(null)}
          title={selectedRequest.shop_name}
          subtitle={`Application Status Details • ${selectedRequest.job_title}`}
        >
          <div className="space-y-4 text-xs sm:text-sm">
            {/* Status Highlight Banner */}
            <div className="p-4 bg-paper-100 rounded-xl border border-paper-border flex items-center justify-between">
              <div>
                <span className="text-ink-500 text-xs block mb-1">Current Delivery Status:</span>
                <RequestStatusBadge status={selectedRequest.status} size="md" />
              </div>
              <div className="text-right text-xs text-ink-500">
                <span>Sent on: {formatDate(selectedRequest.sent_at)}</span>
                {selectedRequest.seen_at && (
                  <span className="block text-sky-700 font-medium">
                    Seen on: {formatDate(selectedRequest.seen_at)}
                  </span>
                )}
              </div>
            </div>

            {/* Application Message Sent by Student */}
            <div>
              <h5 className="font-semibold text-ink-900 mb-1 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-marigold-600" />
                <span>Your Application Message:</span>
              </h5>
              <div className="p-3 bg-white rounded-xl border border-paper-border text-ink-800 leading-relaxed italic text-xs sm:text-sm">
                "{selectedRequest.message}"
              </div>
            </div>

            {/* Employer Response / Note if any */}
            {selectedRequest.employer_note && (
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                <h5 className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Note from Employer ({selectedRequest.employer_name}):</span>
                </h5>
                <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                  {selectedRequest.employer_note}
                </p>
              </div>
            )}

            {/* Next Steps according to status */}
            <div className="p-3 bg-paper-50 rounded-xl border border-paper-border space-y-1.5">
              <span className="font-semibold text-ink-900 block text-xs">Status Guide:</span>
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
