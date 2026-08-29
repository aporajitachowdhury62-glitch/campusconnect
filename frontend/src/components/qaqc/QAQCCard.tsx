import React from 'react';
import { QAQCTask, QAStatus } from '../../types';
import { VendorQABadge } from './VendorQABadge';
import { VendorQCRating } from './VendorQCRating';
import { RoleBadge } from '../common/RoleBadge';
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  Calendar,
  User,
  ArrowRight,
} from 'lucide-react';

export interface QAQCCardProps {
  task?: QAQCTask;
  vendorName?: string;
  category?: string;
  qaStatus?: QAStatus;
  qcScore?: number;
  qcReviewCount?: number;
  onAction?: (action: 'approve' | 'reject' | 'inspect' | 'complete', taskId?: string) => void;
  className?: string;
}

export const QAQCCard: React.FC<QAQCCardProps> = ({
  task,
  vendorName,
  category,
  qaStatus = 'pending',
  qcScore = 0,
  qcReviewCount = 0,
  onAction,
  className = '',
}) => {
  const displayVendor = task?.vendorName || vendorName || 'Neighborhood Vendor';
  const displayCategory = task?.category || category || 'Food & Dining';
  const displayScore = task?.score !== undefined ? task.score : qcScore;
  const status = task?.status || qaStatus;

  const priorityColors = {
    urgent: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse',
    high: 'bg-amber-100 text-amber-900 border-amber-300',
    medium: 'bg-blue-50 text-blue-800 border-blue-200',
    low: 'bg-paper-200 text-ink-600 border-paper-border',
  }[task?.priority || 'medium'];

  const statusBadge = {
    pending: {
      bg: 'bg-amber-50 text-amber-900 border-amber-300',
      icon: Clock,
      label: 'Pending Audit',
    },
    in_progress: {
      bg: 'bg-blue-50 text-blue-800 border-blue-300',
      icon: Clock,
      label: 'In Progress',
    },
    completed: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      icon: CheckCircle2,
      label: 'Passed / Verified',
    },
    verified: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      icon: CheckCircle2,
      label: 'Verified',
    },
    rejected: {
      bg: 'bg-rose-50 text-rose-800 border-rose-300',
      icon: XCircle,
      label: 'Rejected',
    },
    unverified: {
      bg: 'bg-paper-200 text-ink-600 border-paper-border',
      icon: AlertTriangle,
      label: 'Unverified',
    },
  }[status as string] || {
    bg: 'bg-paper-200 text-ink-600 border-paper-border',
    icon: Clock,
    label: 'Pending',
  };

  const StatusIcon = statusBadge.icon;

  return (
    <div
      className={`paper-card p-5 bg-white border border-paper-border rounded-2xl shadow-2xs hover:shadow-warm-md transition-all flex flex-col justify-between group ${className}`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-tealdeep-50 text-tealdeep-800 border border-tealdeep-200">
              <Building2 className="w-3 h-3" />
              <span>{displayCategory}</span>
            </span>

            {task?.priority && (
              <span
                className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md border ${priorityColors}`}
              >
                {task.priority}
              </span>
            )}

            <RoleBadge role="QAC" size="xs" />
          </div>

          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-md border ${statusBadge.bg}`}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{statusBadge.label}</span>
          </span>
        </div>

        {/* Title / Vendor Name */}
        <div className="mb-2">
          <h3 className="font-heading font-bold text-base sm:text-lg text-ink-900 group-hover:text-tealdeep-700 transition-colors">
            {displayVendor}
          </h3>
          {task?.title && (
            <p className="text-xs font-medium text-ink-700 mt-0.5">
              Task: <span className="font-semibold text-ink-900">{task.title}</span>
            </p>
          )}
        </div>

        {/* Description or Notes */}
        <p className="text-xs text-ink-600 leading-relaxed mb-3">
          {task?.description || 'Comprehensive food hygiene, FSSAI licensing compliance and student safety verification audit.'}
        </p>

        {/* Quality Rating / Document Info */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-paper-50 border border-paper-border mb-3 text-xs">
          <div className="flex items-center gap-2">
            <VendorQCRating score={displayScore} reviewCount={qcReviewCount || (displayScore > 0 ? 12 : 0)} size="sm" />
          </div>

          {task?.assignedTo && (
            <div className="flex items-center gap-1 text-ink-500 text-[11px]">
              <User className="w-3 h-3 text-ink-400" />
              <span>Inspector: <strong>{task.assignedTo}</strong></span>
            </div>
          )}

          {task?.dueDate && (
            <div className="flex items-center gap-1 text-ink-500 text-[11px]">
              <Calendar className="w-3 h-3 text-ink-400" />
              <span>Due: {new Date(task.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-paper-border flex items-center justify-between gap-2">
        <VendorQABadge
          status={(status === 'completed' || status === 'verified') ? 'verified' : (status === 'rejected' ? 'rejected' : 'pending')}
          size="xs"
        />

        <div className="flex items-center gap-1.5">
          {onAction && (
            <>
              {status !== 'completed' && status !== 'verified' && (
                <button
                  type="button"
                  onClick={() => onAction('approve', task?.id)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-colors flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verify</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onAction('inspect', task?.id)}
                className="btn-primary py-1 px-3 text-xs flex items-center gap-1"
              >
                <span>Inspect</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QAQCCard;
