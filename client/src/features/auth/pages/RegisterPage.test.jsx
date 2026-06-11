import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { ThemeProvider } from '../../theme/ThemeProvider.jsx';
import { useAuth } from '../useAuth.js';
import RegisterPage from './RegisterPage.jsx';

vi.mock('../useAuth.js', () => ({
  useAuth: vi.fn(),
}));

function renderRegisterPage(authOverrides = {}) {
  const register = vi.fn().mockResolvedValue({ _id: 'user-1' });

  useAuth.mockReturnValue({
    isRestoring: false,
    register,
    ...authOverrides,
  });

  render(
    <ThemeProvider>
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    </ThemeProvider>,
  );

  return { register };
}

describe('RegisterPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('shows client validation errors before submitting', async () => {
    const user = userEvent.setup();
    const { register } = renderRegisterPage();

    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Valid email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(register).not.toHaveBeenCalled();
  });

  test('submits normalized registration values', async () => {
    const user = userEvent.setup();
    const { register } = renderRegisterPage();

    await user.type(screen.getByLabelText('Name'), 'Varun');
    await user.type(screen.getByLabelText('Email'), 'VARUN@Example.COM');
    await user.type(screen.getByLabelText('Password'), 'secret');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith({
        name: 'Varun',
        email: 'varun@example.com',
        password: 'secret',
      });
    });
  });
});
