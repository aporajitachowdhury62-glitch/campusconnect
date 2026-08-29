import React from 'react';
import { QAStatus } from '../../types';
import { ShieldCheck, Clock, AlertCircle, Shield } from 'lucide-react';

export interface VendorQABadgeProps {
  status?: QAStatus;
  size?: 'xs' | 'sm' | 'md';
  showLabel?: boolean;
  showIcon?: boolean;
  onClick?: () => void;
  className?: string;
}

export const VendorQABadge: React.FC<VendorQABadgeProps> = ({
  status = 'unverified',
  size = 'sm',
  showLabel = true,
  showIcon = true,
  onClick,
  className = '',
}) => {
  const config = {
    verified: {
      label: 'FSSAI & Hygiene Verified',
      shortLabel: 'Verified',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      icon: ShieldCheck,
      iconColor: 'text-emerald-600',
      dotColor: 'bg-emerald-500',
    },
    pending: {
      label: 'Verification Pending',
      shortLabel: 'Pending Verification',
      bg: 'bg-amber-50 text-amber-900 border-amber-300',
      icon: Clock,
      iconColor: 'text-amber-600',
      dotColor: 'bg-amber-500',
    },
    rejected: {
      label: 'Verification Rejected',
      shortLabel: 'Unverified / Rejected',
      bg: 'bg-rose-50 text-rose-800 border-rose-300',
      icon: AlertCircle,
      iconColor: 'text-rose-600',
      dotColor: 'bg-rose-500',
    },
    unverified: {
      label: 'Not Yet Verified',
      shortLabel: 'Unverified',
      bg: 'bg-paper-200/90 text-ink-600 border-paper-border',
      icon: Shield,
      iconColor: 'text-ink-400',
      dotColor: 'bg-ink-300',
    },
  }[status] || {
    label: 'Unverified',
    shortLabel: 'Unverified',
    bg: 'bg-paper-200/90 text-ink-600 border-paper-border',
    icon: Shield,
    iconColor: 'text-ink-400',
    dotColor: 'bg-ink-300',
  };

  const Icon = config.icon;

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px] gap-1 rounded',
    sm: 'px-2.5 py-0.5 text-xs gap-1.5 rounded-md font-semibold',
    md: 'px-3 py-1 text-xs sm:text-sm gap-2 rounded-lg font-semibold',
  }[size];

  const iconSizes = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
  }[size];

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center border transition-all shadow-2xs ${config.bg} ${sizeClasses} ${
        onClick ? 'cursor-pointer hover:opacity-90 hover:scale-[1.02]' : ''
      } ${className}`}
      title={config.label}
    >
      {showIcon && <Icon className={`${iconSizes} ${config.iconColor} shrink-0`} />}
      {showLabel && <span>{size === 'xs' ? config.shortLabel : config.label}</span>}
    </span>
  );
};

export default VendorQABadge;
