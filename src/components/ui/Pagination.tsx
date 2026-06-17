
import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/utils';

interface PaginationProps {
  current: number;
  pageSize: number;
  total: number;
  onChange?: (page: number) => void;
  className?: string;
  showTotal?: boolean;
}

export function Pagination({
  current,
  pageSize,
  total,
  onChange,
  className,
  showTotal = true,
}: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const showPages = 5;
    let start = Math.max(1, current - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);
    
    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (start > 1) {
      pages.unshift(1);
      if (start > 2) pages.splice(1, 0, '...');
    }
    if (end < totalPages) {
      pages.push(totalPages);
      if (end < totalPages - 1) pages.splice(pages.length - 1, 0, '...');
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === current) return;
    onChange?.(page);
  };

  return (
    <div className={cn('flex items-center justify-between', className)}>
      {showTotal && (
        <span className="text-sm text-gray-500">
          共 {total} 条记录
        </span>
      )}
      <div className="flex items-center gap-1">
        <button
          onClick={() => handlePageChange(1)}
          disabled={current === 1}
          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronsLeft size={16} />
        </button>
        <button
          onClick={() => handlePageChange(current - 1)}
          disabled={current === 1}
          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>
        {getPageNumbers().map((page, idx) => (
          <button
            key={idx}
            onClick={() => typeof page === 'number' && handlePageChange(page)}
            disabled={page === '...'}
            className={cn(
              'min-w-8 h-8 px-2 text-sm rounded transition-colors',
              page === current
                ? 'bg-blue-700 text-white font-medium'
                : page === '...'
                ? 'text-gray-400 cursor-default'
                : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(current + 1)}
          disabled={current === totalPages}
          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={current === totalPages}
          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
