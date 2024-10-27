import { GenerationButtons } from "@/components/generation/generation-buttons";
import { useGeneratorData } from "@/components/generation/hooks/use-generator-data";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { type Mock, describe, expect, it, vi } from "vitest";

vi.mock("@/components/generation/hooks/use-generator-data");

describe("GenerationButtons Component", () => {
  beforeEach(() => {
    vi.useFakeTimers({
      shouldAdvanceTime: true,
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the GenerationButtons with Run button enabled and Cancel button disabled when not mutating", () => {
    // Arrange
    (useGeneratorData as Mock).mockReturnValue({
      data: null,
      snapshot: null,
      isMutating: false,
      generate: vi.fn(),
      cancel: vi.fn(),
    });

    // Act
    render(<GenerationButtons />);

    // Assert
    const runButton = screen.getByTestId("run-button");
    const cancelButton = screen.getByTestId("cancel-button");

    expect(runButton).toBeInTheDocument();
    expect(runButton).toBeEnabled();
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toBeDisabled();
  });

  it("calls generate when Run button is clicked", async () => {
    // Arrange
    const mockGenerate = vi.fn().mockResolvedValue(undefined);
    (useGeneratorData as Mock).mockReturnValue({
      data: null,
      snapshot: null,
      isMutating: false,
      generate: mockGenerate,
      cancel: vi.fn(),
    });
    render(<GenerationButtons />);

    // Act
    userEvent.click(screen.getByTestId("run-button"));

    // Assert
    await waitFor(() => {
      expect(mockGenerate).toHaveBeenCalled();
    });
  });

  it("calls cancel when Cancel button is clicked", async () => {
    // Arrange
    const mockCancel = vi.fn().mockResolvedValue(undefined);
    (useGeneratorData as Mock).mockReturnValue({
      data: null,
      snapshot: null,
      isMutating: true,
      generate: vi.fn(),
      cancel: mockCancel,
    });
    render(<GenerationButtons />);

    // Act
    userEvent.click(screen.getByTestId("cancel-button"));

    // Assert
    await waitFor(() => {
      expect(mockCancel).toHaveBeenCalled();
    });
  });

  it("displays 'Run' tooltip on hover over run button", async () => {
    // Arrange
    (useGeneratorData as Mock).mockReturnValue({
      data: null,
      snapshot: null,
      isMutating: false,
      generate: vi.fn(),
      cancel: vi.fn(),
    });
    render(<GenerationButtons />);

    // Act
    await userEvent.hover(screen.getByTestId("run-button"));
    vi.advanceTimersByTime(500);

    // Assert
    await waitFor(() => {
      expect(screen.getByRole("tooltip", { name: "Run" })).toBeInTheDocument();
    });
  });

  it("displays 'Cancel' tooltip on hover over cancel button", async () => {
    // Arrange
    (useGeneratorData as Mock).mockReturnValue({
      data: null,
      snapshot: null,
      isMutating: false,
      generate: vi.fn(),
      cancel: vi.fn(),
    });
    render(<GenerationButtons />);

    // Act
    await userEvent.hover(screen.getByTestId("cancel-button"));
    vi.advanceTimersByTime(500);

    // Assert
    await waitFor(() => {
      expect(screen.getByRole("tooltip", { name: "Cancel" })).toBeInTheDocument();
    });
  });
});
