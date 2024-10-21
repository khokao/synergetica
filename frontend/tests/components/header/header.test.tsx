import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from '@/components/header/header'

describe('Header Component', () => {
  it('renders header with Studio and Project navigation items', () => {
    // Arrange
    render(<Header />)

    // Act
    const studioNavItem = screen.getByText('Studio')
    const projectNavItem = screen.getByText('Project')

    // Assert
    expect(studioNavItem).toBeInTheDocument()
    expect(projectNavItem).toBeInTheDocument()
  })
})
