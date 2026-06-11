import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { ThemeProvider } from '../../theme/ThemeProvider.jsx';
import { useAuth } from '../useAuth.js';
import LoginPage from './LoginPage.jsx';

vi.mock('../useAuth.js', () => ({
  useAuth: vi.fn(),
}));

function renderLoginPage(authOverrides = {}) {
  const login = vi.fn().mockResolvedValue({ _id: 'user-1' });

  useAuth.mockReturnValue({
    isRestoring: false,
    login,
    ...authOverrides,
  });

  render(
    <ThemeProvider>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </ThemeProvider>,
  );

  return { login };
}

describe('LoginPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('shows client validation errors before submitting', async () => {
    const user = userEvent.setup();
    const { login } = renderLoginPage();

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Valid email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(login).not.toHaveBeenCalled();
  });

  test('submits normalized credentials', async () => {
    const user = userEvent.setup();
    const { login } = renderLoginPage();

    await user.type(screen.getByLabelText('Email'), 'USER@Example.COM');
    await user.type(screen.getByLabelText('Password'), 'secret');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'secret',
      });
    });
  });
});
