import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { DnDPanel } from '@/components/circuit/dnd/dnd-panel';
import { describe, it, expect, vi } from 'vitest';
import userEvent from "@testing-library/user-event";


const setDnDCategoryMock = vi.fn();

vi.mock('@/components/circuit/dnd/dnd-context', () => ({
  useDnD: () => [null, setDnDCategoryMock],
}));

describe('DnDPanel', () => {
  beforeEach(() => {
    vi.useFakeTimers({
      shouldAdvanceTime: true,
    })
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('displays the tooltip when hovering over an icon', async () => {
    // Arrange
    render(<DnDPanel />);

    // Act
    userEvent.hover(screen.getByTestId("icon-promoter"));
    userEvent.hover(screen.getByTestId("icon-protein"));
    userEvent.hover(screen.getByTestId("icon-terminator"));
    vi.advanceTimersByTime(500);

    // Assert
    await waitFor(() => {
      expect(screen.getByRole("tooltip", { name: "Promoter" })).toBeInTheDocument();
      expect(screen.getByRole("tooltip", { name: "Protein" })).toBeInTheDocument();
      expect(screen.getByRole("tooltip", { name: "Terminator" })).toBeInTheDocument();
    });
  });

  it('calls the onDragStart function with the correct node category when dragging starts', () => {
    // Arrange
    render(<DnDPanel />);

    // Act
    fireEvent.dragStart(screen.getByTestId("icon-promoter"));

    // Assert
    expect(setDnDCategoryMock).toHaveBeenCalledWith('promoter');
  });
});
