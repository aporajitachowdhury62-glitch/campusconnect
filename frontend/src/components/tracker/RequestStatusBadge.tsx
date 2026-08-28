import React from 'react';
import { ConnectionStatus } from '../../types';
import { Check, CheckCheck, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface RequestStatusBadgeProps {
  status: ConnectionStatus;
  size?: 'xs' | 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}

export const RequestStatusBadge: React.FC<RequestStatusBadgeProps> = ({
  status,
  size = 'sm',
  showLabel = true,
  className = '',
}) => {
  const config = {
    sent: {
      label: 'Sent',
      longLabel: 'Sent (Delivered to Shopkeeper)',
      bg: 'bg-slate-100 text-slate-700 border-slate-300',
      icon: Check,
      iconColor: 'text-slate-500',
      description: 'Single tick — application has left student side',
    },
    seen: {
      label: 'Seen',
      longLabel: 'Seen by Shopkeeper',
      bg: 'bg-sky-50 text-sky-800 border-sky-300',
      icon: CheckCheck,
      iconColor: 'text-sky-600',
      description: 'Double tick — shopkeeper has opened and viewed your request',
    },
    accepted: {
      label: 'Accepted',
      longLabel: 'Connection Accepted',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
      description: 'Green check — employer approved your application',
    },
    rejected: {
      label: 'Declined',
      longLabel: 'Application Declined',
      bg: 'bg-rose-50 text-rose-800 border-rose-300',
      icon: XCircle,
      iconColor: 'text-rose-600',
      description: 'Red cross — employer filled the position or declined',
    },
    expired: {
      label: 'Expired',
      longLabel: 'No Response / Expired',
      bg: 'bg-paper-200 text-ink-600 border-paper-border',
      icon: Clock,
      iconColor: 'text-ink-400',
      description: 'No response after expiry period',
    },
  }[status] || {
    label: 'Sent',
    longLabel: 'Sent',
    bg: 'bg-slate-100 text-slate-700 border-slate-300',
    icon: Check,
    iconColor: 'text-slate-500',
    description: 'Sent',
  };

  const Icon = config.icon;

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px] gap-1 rounded',
    sm: 'px-2.5 py-0.5 text-xs gap-1.5 rounded-md font-semibold',
    md: 'px-3 py-1 text-xs sm:text-sm gap-2 rounded-lg font-semibold',
  }[size];

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
  }[size];

  return (
    <span
      className={`inline-flex items-center border transition-colors shadow-2xs ${config.bg} ${sizeClasses} ${className}`}
      title={`${config.longLabel} • ${config.description}`}
    >
      <Icon className={`${iconSizes} ${config.iconColor} shrink-0`} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
};
