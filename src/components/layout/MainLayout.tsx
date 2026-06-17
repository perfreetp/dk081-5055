
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const pageTitleMap: Record<string, string> = {
  '/dashboard': '工作台',
  '/retire-list': '退休名单',
  '/archive-check': '职工档案核对',
  '/material': '材料协同',
  '/declaration': '批量申报',
  '/result': '结果回传',
  '/statistics/ledger': '退休台账',
  '/statistics/analysis': '统计分析',
  '/settings': '系统设置',
};

export function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    for (const [path, title] of Object.entries(pageTitleMap)) {
      if (location.pathname.startsWith(path)) {
        return title;
      }
    }
    return '退休批量申报协同系统';
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={getPageTitle()} onMenuClick={() => setCollapsed(!collapsed)} />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
