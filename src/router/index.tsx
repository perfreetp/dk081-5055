
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import Dashboard from '@/pages/dashboard';
import RetireList from '@/pages/retire-list';
import ArchiveCheck from '@/pages/archive-check';
import Material from '@/pages/material';
import Declaration from '@/pages/declaration';
import Result from '@/pages/result';
import Ledger from '@/pages/statistics/Ledger';
import Analysis from '@/pages/statistics/Analysis';
import Settings from '@/pages/settings';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'retire-list', element: <RetireList /> },
      { path: 'archive-check', element: <ArchiveCheck /> },
      { path: 'material', element: <Material /> },
      { path: 'declaration', element: <Declaration /> },
      { path: 'result', element: <Result /> },
      { path: 'statistics/ledger', element: <Ledger /> },
      { path: 'statistics/analysis', element: <Analysis /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]);

export default router;
