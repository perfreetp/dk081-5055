
import React from 'react';
import { cn, getStatusColorClasses } from '@/utils';

interface StatusBadgeProps {
  status: { label: string; color: string };
  size?: 'sm' | 'md';
  className?: string;
}

export function StatusBadge({ status, size = 'md', className }: StatusBadgeProps) {
  const colors = getStatusColorClasses(status.color);
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs' 
    : 'px-2.5 py-1 text-xs';

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full font-medium',
      colors.bg,
      colors.text,
      sizeClasses,
      className
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full', colors.dot)} />
      {status.label}
    </span>
  );
}

export default StatusBadge;
