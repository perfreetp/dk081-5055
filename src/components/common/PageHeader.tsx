
import React from 'react';
import { cn } from '@/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  extra?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  extra,
  breadcrumb,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-6', className)}>
      {breadcrumb && <div className="mb-2 text-sm text-gray-500">{breadcrumb}</div>}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
        {extra && <div className="flex items-center gap-2 flex-shrink-0">{extra}</div>}
      </div>
    </div>
  );
}

export default PageHeader;
