import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../features/theme/ThemeProvider.jsx';

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </ThemeProvider>
  );
}
