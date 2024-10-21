import { render, screen } from '@testing-library/react';
import { NavItem } from '@/components/header/nav-item';
import { vi } from 'vitest';
import { CircuitBoard, BookMarked } from 'lucide-react';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/studio'),
}));

describe('NavItem Component', () => {
  it('displays active styles when the current path matches the href', () => {
    // Arrange
    const href = '/studio';
    const label = 'Studio';
    const icon = CircuitBoard;

    // Act
    render(<NavItem href={href} icon={icon} label={label} />);

    // Assert
    expect(screen.getByTestId("nav-item-button")).toHaveClass('bg-white', 'text-gray-900', 'shadow-md');
  });

  it('displays inactive styles when the current path does not match the href', () => {
    // Arrange
    const href = '/project';
    const label = 'Project';
    const icon = BookMarked;

    // Act
    render(<NavItem href={href} icon={icon} label={label} />);

    // Assert
    expect(screen.getByTestId("nav-item-button")).toHaveClass('text-gray-600', 'hover:text-gray-800');
  });
});
