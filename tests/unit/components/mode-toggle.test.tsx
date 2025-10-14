import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ModeToggle } from '@/components/mode-toggle'

// Mock next-themes
const mockSetTheme = jest.fn()
const mockUseTheme = jest.fn()

jest.mock('next-themes', () => ({
  useTheme: () => mockUseTheme(),
}))

describe('ModeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
      resolvedTheme: 'light',
    })
  })

  it('renders without crashing', () => {
    render(<ModeToggle />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('shows loading state initially', () => {
    // Mock useState to return false for mounted state
    const originalUseState = React.useState
    jest.spyOn(React, 'useState').mockImplementation((initial) => {
      if (initial === false) return [false, jest.fn()]
      return originalUseState(initial)
    })
    
    render(<ModeToggle />)
    expect(screen.getByText('Chargement du thème')).toBeInTheDocument()
    
    // Restore original useState
    jest.restoreAllMocks()
  })

  it('toggles theme when clicked', () => {
    render(<ModeToggle />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(mockSetTheme).toHaveBeenCalled()
  })

  it('displays correct icon for light theme', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
      resolvedTheme: 'light',
    })

    render(<ModeToggle />)
    
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument()
  })

  it('displays correct icon for dark theme', () => {
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
      resolvedTheme: 'dark',
    })

    render(<ModeToggle />)
    
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
  })
})