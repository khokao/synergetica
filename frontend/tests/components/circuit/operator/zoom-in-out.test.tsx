import { ZoomInOut } from "@/components/circuit/operator/zoom-in-out";
import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

const zoomInMock = vi.fn();
const zoomOutMock = vi.fn();

vi.mock("@xyflow/react", () => {
  return {
    useReactFlow: () => ({
      zoomIn: zoomInMock,
      zoomOut: zoomOutMock,
    }),
    useViewport: () => ({
      zoom: 1,
    }),
  };
});

describe("ZoomInOut Component", () => {
  it("displays the correct zoom percentage", () => {
    // Act
    render(<ZoomInOut />);

    // Assert
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("calls zoomOut when zoom out button is clicked", () => {
    // Arrange
    render(<ZoomInOut />);

    // Act
    fireEvent.click(screen.getByLabelText("zoom out"));

    // Assert
    expect(zoomOutMock).toHaveBeenCalledTimes(1);
  });

  it("calls zoomIn when zoom in button is clicked", () => {
    // Arrange
    render(<ZoomInOut />);

    // Act
    fireEvent.click(screen.getByLabelText("zoom in"));

    // Assert
    expect(zoomInMock).toHaveBeenCalledTimes(1);
  });
});
