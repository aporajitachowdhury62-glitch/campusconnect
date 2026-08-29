import React from 'react';
import { GraduationCap, Store, ShieldCheck, User } from 'lucide-react';
import { UserRoleType } from '../../types';

export interface RoleBadgeProps {
  role: UserRoleType | 'Student' | 'Shopkeeper' | 'QAC' | 'student' | 'shopkeeper' | 'qac' | 'QAQC' | string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({
  role,
  size = 'sm',
  showIcon = true,
  className = '',
}) => {
  const normalizedRole = (role || '').toLowerCase();

  let label = 'User';
  let badgeStyle = 'bg-paper-100 text-ink-700 border-paper-border';
  let iconColor = 'text-ink-500';
  let IconComponent = User;

  if (normalizedRole.includes('student')) {
    label = 'Student';
    badgeStyle = 'bg-marigold-50 text-marigold-900 border-marigold-300';
    iconColor = 'text-marigold-700';
    IconComponent = GraduationCap;
  } else if (normalizedRole.includes('shop') || normalizedRole.includes('employer')) {
    label = 'Shopkeeper';
    badgeStyle = 'bg-tealdeep-50 text-tealdeep-900 border-tealdeep-300';
    iconColor = 'text-tealdeep-700';
    IconComponent = Store;
  } else if (normalizedRole.includes('qa') || normalizedRole.includes('qac') || normalizedRole.includes('qc') || normalizedRole.includes('inspector')) {
    label = 'QAC Inspector';
    badgeStyle = 'bg-indigo-50 text-indigo-900 border-indigo-300';
    iconColor = 'text-indigo-600';
    IconComponent = ShieldCheck;
  }

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px] gap-1 rounded',
    sm: 'px-2 py-0.5 text-xs gap-1.5 rounded-md font-semibold',
    md: 'px-2.5 py-1 text-sm gap-1.5 rounded-lg font-semibold',
    lg: 'px-3 py-1.5 text-base gap-2 rounded-xl font-bold',
  }[size];

  const iconSizes = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  return (
    <span
      className={`inline-flex items-center border font-sans tracking-wide transition-colors ${badgeStyle} ${sizeClasses} ${className}`}
      title={`Role: ${label}`}
    >
      {showIcon && <IconComponent className={`${iconSizes} ${iconColor} shrink-0`} />}
      <span>{label}</span>
    </span>
  );
};

export default RoleBadge;
