import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../features/auth/AuthProvider.jsx';
import { ThemeProvider } from '../../features/theme/ThemeProvider.jsx';

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>{children}</AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
