import { ZoomInOut } from "@/components/circuit/operator/zoom-in-out";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("displays the correct zoom percentage", () => {
    // Act
    render(<ZoomInOut />);

    // Assert
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("calls zoomOut when zoom out button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<ZoomInOut />);

    // Act
    await user.click(screen.getByLabelText("zoom out"));

    // Assert
    expect(zoomOutMock).toHaveBeenCalledTimes(1);
  });

  it("calls zoomIn when zoom in button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<ZoomInOut />);

    // Act
    await user.click(screen.getByLabelText("zoom in"));

    // Assert
    expect(zoomInMock).toHaveBeenCalledTimes(1);
  });

  it("displays zoom out tooltip on hover over button", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<ZoomInOut />);

    // Act
    await user.hover(screen.getByLabelText("zoom out"));

    // Assert
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent("Zoom out");
    });
  });

  it("displays zoom in tooltip on hover over button", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<ZoomInOut />);

    // Act
    await user.hover(screen.getByLabelText("zoom in"));

    // Assert
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent("Zoom in");
    });
  });
});
