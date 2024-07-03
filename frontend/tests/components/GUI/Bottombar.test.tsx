import { Bottombar } from "@/components/GUI/Bottombar";
import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

describe("Bottombar", () => {
  it("should render all nodes", () => {
    render(<Bottombar />);

    expect(screen.getByAltText("promoter")).toBeInTheDocument();
    expect(screen.getByAltText("visible")).toBeInTheDocument();
    expect(screen.getByAltText("terminator")).toBeInTheDocument();
  });

  it("should start dragging with correct data on drag start", () => {
    // Arrange
    render(<Bottombar />);
    const nodeElement = screen.getByAltText("promoter").closest("div");

    if (nodeElement) {
      const mockDataTransfer = {
        setData: vi.fn(),
        effectAllowed: "",
      };

      const mockDragEvent = {
        dataTransfer: mockDataTransfer,
      } as unknown as React.DragEvent;

      // Act
      fireEvent.dragStart(nodeElement, mockDragEvent);

      // Assert
      expect(mockDataTransfer.setData).toHaveBeenCalledWith("application/reactflow-node-type", "promoter");
      expect(mockDataTransfer.setData).toHaveBeenCalledWith(
        "application/reactflow-icon-url",
        "/images/node-promoter.svg",
      );
      expect(mockDataTransfer.setData).toHaveBeenCalledWith(
        "application/reactflow-left-handle-style",
        JSON.stringify({ top: 68, left: 5 }),
      );
      expect(mockDataTransfer.setData).toHaveBeenCalledWith(
        "application/reactflow-right-handle-style",
        JSON.stringify({ top: 68, left: 180 }),
      );
      expect(mockDataTransfer.effectAllowed).toBe("move");
    } else {
      throw new Error("Node element not found");
    }
  });
});
