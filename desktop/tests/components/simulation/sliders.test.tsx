import { useSimulator } from "@/components/simulation/simulator-context";
import { Sliders } from "@/components/simulation/sliders";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/simulation/simulator-context", () => ({
  useSimulator: vi.fn(),
}));

describe("Sliders Component", () => {
  // JSDOM lacks pointer capture APIs, so we mock them for Radix UI tests.
  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, "setPointerCapture", { value: () => {} });
    Object.defineProperty(HTMLElement.prototype, "releasePointerCapture", { value: () => {} });
    Object.defineProperty(HTMLElement.prototype, "hasPointerCapture", { value: () => false });
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders sliders with correct labels", () => {
    // Arrange
    vi.mocked(useSimulator).mockReturnValue({
      proteinName2Ids: { ProteinA: ["child-1"], ProteinB: ["child-2", "child-3"] },
      proteinParameters: { "child-1": 100, "child-2": 200, "child-3": 300 },
      setProteinParameters: vi.fn(),
      // biome-ignore  lint/suspicious/noExplicitAny: For brevity and clarity.
    } as any);

    // Act
    render(<Sliders />);

    // Assert
    expect(screen.getByTestId("slider-label-ProteinA-1")).toHaveTextContent("ProteinA");
    expect(screen.getByTestId("slider-label-ProteinA-1")).not.toHaveTextContent("ProteinA[1]");
    expect(screen.getByTestId("slider-label-ProteinB-1")).toHaveTextContent("ProteinB[1]");
    expect(screen.getByTestId("slider-label-ProteinB-2")).toHaveTextContent("ProteinB[2]");
  });

  it("calls setProteinParameters when slider value changes", async () => {
    // Arrange
    const user = userEvent.setup();

    const mockSetProteinParameters = vi.fn();
    vi.mocked(useSimulator).mockReturnValue({
      proteinName2Ids: { ProteinA: ["child-1"] },
      proteinParameters: { "child-1": 100 },
      setProteinParameters: mockSetProteinParameters,
      // biome-ignore  lint/suspicious/noExplicitAny: For brevity and clarity.
    } as any);

    // Act
    render(<Sliders />);

    // Change slider value
    const slider = screen.getByRole("slider");
    await user.type(slider, "{ArrowRight}");

    // Assert
    expect(mockSetProteinParameters).toHaveBeenCalled();
  });

  it("calls setProteinParameters when input value changes", async () => {
    // Arrange
    const user = userEvent.setup();

    const mockSetProteinParameters = vi.fn();
    vi.mocked(useSimulator).mockReturnValue({
      proteinName2Ids: { ProteinA: ["child-1"] },
      proteinParameters: { "child-1": 12 },
      setProteinParameters: mockSetProteinParameters,
      // biome-ignore  lint/suspicious/noExplicitAny: For brevity and clarity.
    } as any);

    // Act
    render(<Sliders />);

    const input = screen.getByRole("spinbutton") as HTMLInputElement;

    await user.type(input, "3");

    // Assert
    expect(mockSetProteinParameters).toHaveBeenCalled();
    const updateFn = mockSetProteinParameters.mock.calls[0][0];
    const prevState = { "child-1": 12 };
    const newState = updateFn(prevState);
    expect(newState["child-1"]).toBe(123);
  });
});
