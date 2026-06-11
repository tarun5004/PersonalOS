import { lazy } from 'react';

const DashboardPage = lazy(() => import('../../features/dashboard/pages/DashboardPage.jsx'));
const TasksPage = lazy(() => import('../../features/tasks/pages/TasksPage.jsx'));
const HabitsPage = lazy(() => import('../../features/habits/pages/HabitsPage.jsx'));
const AnalyticsPage = lazy(() => import('../../features/analytics/pages/AnalyticsPage.jsx'));
const SettingsPage = lazy(() => import('../../features/settings/pages/SettingsPage.jsx'));
const LoginPage = lazy(() => import('../../features/auth/pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('../../features/auth/pages/RegisterPage.jsx'));

export const appRoutes = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    Component: DashboardPage,
    showInNav: true,
  },
  {
    path: '/tasks',
    label: 'Tasks',
    Component: TasksPage,
    showInNav: true,
  },
  {
    path: '/habits',
    label: 'Habits',
    Component: HabitsPage,
    showInNav: true,
  },
  {
    path: '/analytics',
    label: 'Analytics',
    Component: AnalyticsPage,
    showInNav: true,
  },
  {
    path: '/settings',
    label: 'Settings',
    Component: SettingsPage,
    showInNav: true,
  },
  {
    path: '/login',
    label: 'Login',
    Component: LoginPage,
    showInNav: false,
  },
  {
    path: '/register',
    label: 'Register',
    Component: RegisterPage,
    showInNav: false,
  },
];

