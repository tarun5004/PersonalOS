import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../features/auth/AuthProvider.jsx';
import { PomodoroProvider } from '../../features/pomodoro/PomodoroProvider.jsx';
import { ThemeProvider } from '../../features/theme/ThemeProvider.jsx';
import { createQueryClient } from './queryClient.js';

const queryClient = createQueryClient();

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <PomodoroProvider>{children}</PomodoroProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
