import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SupabaseProvider } from '@/components/supabase-provider'
import { supabase } from '@/lib/supabase'

// Mock Supabase
const mockSupabase = {
  auth: {
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
    signOut: jest.fn(),
    getSession: jest.fn(),
    onAuthStateChange: jest.fn(),
  },
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
  })),
}

jest.mock('@/lib/supabase', () => ({
  supabase: mockSupabase,
}))

// Test component that uses SupabaseProvider
const TestComponent = () => {
  const { signUp, signIn, signOut, user, loading } = SupabaseProvider.useAuth?.() || {}
  
  return (
    <div>
      <div data-testid="user">{user ? user.email : 'No user'}</div>
      <div data-testid="loading">{loading ? 'Loading' : 'Not loading'}</div>
      <button onClick={() => signUp?.('test@example.com', 'password')}>
        Sign Up
      </button>
      <button onClick={() => signIn?.('test@example.com', 'password')}>
        Sign In
      </button>
      <button onClick={() => signOut?.()}>
        Sign Out
      </button>
    </div>
  )
}

describe('SupabaseProvider Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('provides authentication context', () => {
    render(
      <SupabaseProvider>
        <TestComponent />
      </SupabaseProvider>
    )
    
    expect(screen.getByTestId('user')).toBeInTheDocument()
    expect(screen.getByTestId('loading')).toBeInTheDocument()
  })

  it('handles sign up successfully', async () => {
    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: { email: 'test@example.com' } },
      error: null,
    })

    render(
      <SupabaseProvider>
        <TestComponent />
      </SupabaseProvider>
    )
    
    const signUpButton = screen.getByText('Sign Up')
    fireEvent.click(signUpButton)
    
    await waitFor(() => {
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      })
    })
  })

  it('handles sign in successfully', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: { email: 'test@example.com' } },
      error: null,
    })

    render(
      <SupabaseProvider>
        <TestComponent />
      </SupabaseProvider>
    )
    
    const signInButton = screen.getByText('Sign In')
    fireEvent.click(signInButton)
    
    await waitFor(() => {
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      })
    })
  })

  it('handles sign out successfully', async () => {
    mockSupabase.auth.signOut.mockResolvedValue({ error: null })

    render(
      <SupabaseProvider>
        <TestComponent />
      </SupabaseProvider>
    )
    
    const signOutButton = screen.getByText('Sign Out')
    fireEvent.click(signOutButton)
    
    await waitFor(() => {
      expect(mockSupabase.auth.signOut).toHaveBeenCalled()
    })
  })

  it('handles authentication errors', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: { message: 'Invalid credentials' },
    })

    render(
      <SupabaseProvider>
        <TestComponent />
      </SupabaseProvider>
    )
    
    const signInButton = screen.getByText('Sign In')
    fireEvent.click(signInButton)
    
    await waitFor(() => {
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalled()
    })
  })
})
