
import React from 'react';
import { cn } from '@/utils';

interface TagProps {
  children: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'orange' | 'gray' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
}

const colorClasses: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-emerald-100 text-emerald-700',
  red: 'bg-red-100 text-red-700',
  orange: 'bg-amber-100 text-amber-700',
  gray: 'bg-gray-100 text-gray-600',
  purple: 'bg-purple-100 text-purple-700',
};

export function Tag({ children, color = 'blue', size = 'md', className }: TagProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  
  return (
    <span className={cn(
      'inline-flex items-center rounded font-medium',
      colorClasses[color],
      sizeClasses,
      className
    )}>
      {children}
    </span>
  );
}

export default Tag;
