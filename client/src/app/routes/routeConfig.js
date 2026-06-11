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
    description: 'Daily overview',
    Component: DashboardPage,
    access: 'protected',
    showInNav: true,
  },
  {
    path: '/tasks',
    label: 'Tasks',
    description: 'Personal task list',
    Component: TasksPage,
    access: 'protected',
    showInNav: true,
  },
  {
    path: '/habits',
    label: 'Habits',
    description: 'Habit check-ins',
    Component: HabitsPage,
    access: 'protected',
    showInNav: true,
  },
  {
    path: '/analytics',
    label: 'Analytics',
    description: 'Weekly trends',
    Component: AnalyticsPage,
    access: 'protected',
    showInNav: true,
  },
  {
    path: '/settings',
    label: 'Settings',
    description: 'Theme and user context',
    Component: SettingsPage,
    access: 'protected',
    showInNav: true,
  },
  {
    path: '/login',
    label: 'Login',
    Component: LoginPage,
    access: 'public',
    showInNav: false,
  },
  {
    path: '/register',
    label: 'Register',
    Component: RegisterPage,
    access: 'public',
    showInNav: false,
  },
];

export const protectedRoutes = appRoutes.filter((route) => route.access === 'protected');

export const publicRoutes = appRoutes.filter((route) => route.access === 'public');
