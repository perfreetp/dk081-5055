
import React, { useState } from 'react';
import { cn } from '@/utils';

interface TabItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
  className?: string;
  type?: 'line' | 'card';
}

export function Tabs({
  items,
  activeKey,
  defaultActiveKey,
  onChange,
  className,
  type = 'line',
}: TabsProps) {
  const [internalKey, setInternalKey] = useState(defaultActiveKey || items[0]?.key);
  const currentKey = activeKey ?? internalKey;

  const handleClick = (key: string, disabled?: boolean) => {
    if (disabled) return;
    if (activeKey === undefined) {
      setInternalKey(key);
    }
    onChange?.(key);
  };

  if (type === 'card') {
    return (
      <div className={cn('border-b border-gray-200', className)}>
        <div className="flex gap-1 px-4">
          {items.map((item) => (
            <button
              key={item.key}
              onClick={() => handleClick(item.key, item.disabled)}
              disabled={item.disabled}
              className={cn(
                'px-4 py-2.5 text-sm font-medium transition-colors rounded-t-lg',
                '-mb-px border border-b-0',
                currentKey === item.key
                  ? 'bg-white border-gray-200 text-blue-700'
                  : 'bg-gray-50 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100',
                item.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('border-b border-gray-200', className)}>
      <div className="flex gap-8 px-1">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => handleClick(item.key, item.disabled)}
            disabled={item.disabled}
            className={cn(
              'px-1 py-3 text-sm font-medium transition-colors relative',
              currentKey === item.key
                ? 'text-blue-700'
                : 'text-gray-500 hover:text-gray-700',
              item.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.label}
            {currentKey === item.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Tabs;
