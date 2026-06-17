
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileCheck,
  FileText,
  Send,
  Inbox,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
} from 'lucide-react';
import { cn } from '@/utils';

interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { key: 'dashboard', label: '工作台', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
  { key: 'retire-list', label: '退休名单', icon: <Users size={20} />, path: '/retire-list' },
  { key: 'archive-check', label: '职工档案核对', icon: <FileCheck size={20} />, path: '/archive-check' },
  { key: 'material', label: '材料协同', icon: <FileText size={20} />, path: '/material' },
  { key: 'declaration', label: '批量申报', icon: <Send size={20} />, path: '/declaration' },
  { key: 'result', label: '结果回传', icon: <Inbox size={20} />, path: '/result' },
  {
    key: 'statistics',
    label: '台账统计',
    icon: <BarChart3 size={20} />,
    path: '/statistics/ledger',
    children: [
      { key: 'ledger', label: '退休台账', icon: null, path: '/statistics/ledger' },
      { key: 'analysis', label: '统计分析', icon: null, path: '/statistics/analysis' },
    ],
  },
  { key: 'settings', label: '系统设置', icon: <Settings size={20} />, path: '/settings' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState<string[]>(['statistics']);

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const toggleSubmenu = (key: string) => {
    setOpenKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <aside
      className={cn(
        'h-screen bg-slate-800 text-white flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      <div className={cn(
        'h-14 flex items-center border-b border-slate-700',
        collapsed ? 'justify-center px-2' : 'px-5'
      )}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 size={18} />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold whitespace-nowrap">退休申报系统</h1>
              <p className="text-[10px] text-slate-400 whitespace-nowrap">Retirement Declaration</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 py-3 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.key}>
            {item.children ? (
              <div>
                <button
                  onClick={() => toggleSubmenu(item.key)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                    'hover:bg-slate-700/50 text-slate-300 hover:text-white',
                    collapsed && 'justify-center px-2'
                  )}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {openKeys.includes(item.key) ? (
                        <ChevronRight size={16} className="rotate-90" />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </>
                  )}
                </button>
                {!collapsed && openKeys.includes(item.key) && (
                  <div className="bg-slate-900/50">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.key}
                        to={child.path}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-3 pl-12 pr-4 py-2 text-sm transition-colors',
                            isActive
                              ? 'bg-blue-600/20 text-blue-400 border-r-2 border-blue-500'
                              : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                          )
                        }
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                    'hover:bg-slate-700/50',
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border-r-2 border-blue-500'
                      : 'text-slate-300 hover:text-white',
                    collapsed && 'justify-center px-2'
                  )
                }
                title={collapsed ? item.label : undefined}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      <button
        onClick={onToggle}
        className="h-10 border-t border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </aside>
  );
}

export default Sidebar;
