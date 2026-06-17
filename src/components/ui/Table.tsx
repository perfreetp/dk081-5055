
import React from 'react';
import { cn } from '@/utils';

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: keyof T | ((row: T) => string);
  className?: string;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyText?: string;
  selectable?: boolean;
  selectedKeys?: string[];
  onSelectChange?: (keys: string[]) => void;
}

export interface TableColumn<T> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, record: T, index: number) => React.ReactNode;
  fixed?: 'left' | 'right';
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  rowKey,
  className,
  onRowClick,
  loading = false,
  emptyText = '暂无数据',
  selectable = false,
  selectedKeys = [],
  onSelectChange,
}: TableProps<T>) {
  const getRowKey = (row: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(row);
    }
    return String(row[rowKey] ?? index);
  };

  const allSelected = data.length > 0 && data.every((row) => selectedKeys.includes(getRowKey(row, 0)));

  const handleSelectAll = () => {
    if (!onSelectChange) return;
    if (allSelected) {
      onSelectChange([]);
    } else {
      onSelectChange(data.map((row, idx) => getRowKey(row, idx)));
    }
  };

  const handleSelectRow = (key: string) => {
    if (!onSelectChange) return;
    if (selectedKeys.includes(key)) {
      onSelectChange(selectedKeys.filter((k) => k !== key));
    } else {
      onSelectChange([...selectedKeys, key]);
    }
  };

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {selectable && (
              <th className="px-4 py-3 w-10 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={cn(
                  'px-4 py-3 font-semibold text-gray-700 whitespace-nowrap',
                  col.align === 'center' && 'text-center',
                  col.align === 'right' && 'text-right',
                  col.fixed === 'left' && 'sticky left-0 bg-gray-50 z-10',
                  col.fixed === 'right' && 'sticky right-0 bg-gray-50 z-10'
                )}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {loading ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-12 text-center text-gray-500">
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  加载中...
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-12 text-center text-gray-400">
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, index) => {
              const key = getRowKey(row, index);
              const isSelected = selectedKeys.includes(key);
              return (
                <tr
                  key={key}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-blue-50',
                    isSelected && 'bg-blue-50'
                  )}
                >
                  {selectable && (
                    <td className="px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectRow(key);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    </td>
                  )}
                  {columns.map((col) => {
                    const value = col.dataIndex ? row[col.dataIndex] : undefined;
                    return (
                      <td
                        key={col.key}
                        className={cn(
                          'px-4 py-3 text-gray-700 whitespace-nowrap',
                          col.align === 'center' && 'text-center',
                          col.align === 'right' && 'text-right',
                          col.fixed === 'left' && 'sticky left-0 bg-inherit z-10',
                          col.fixed === 'right' && 'sticky right-0 bg-inherit z-10'
                        )}
                      >
                        {col.render ? col.render(value, row, index) : value}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
