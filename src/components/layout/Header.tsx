
import React, { useState } from 'react';
import { Bell, Search, User, ChevronDown, Menu } from 'lucide-react';
import { cn } from '@/utils';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 hover:bg-gray-100 rounded-md text-gray-600"
        >
          <Menu size={20} />
        </button>
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
      </div>

      <div className="flex items-center gap-3">
        <div className={cn(
          'relative transition-all duration-200',
          searchFocused ? 'w-64' : 'w-48'
        )}>
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="搜索人员、批次..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>

        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <User size={16} />
            </div>
            <span className="text-sm text-gray-700">管理员</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {userMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setUserMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left">
                  个人信息
                </button>
                <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left">
                  修改密码
                </button>
                <div className="my-1 border-t border-gray-100" />
                <button className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50 text-left">
                  退出登录
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
