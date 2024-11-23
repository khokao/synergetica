import { GenerationButtons } from "@/components/generation/generation-buttons";
import { useGeneratorData } from "@/components/generation/hooks/use-generator-data";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { toast } from "sonner";
import { type Mock, describe, expect, it, vi } from "vitest";

vi.mock("@/components/generation/hooks/use-generator-data");
vi.mock("sonner", () => ({
  toast: {
    loading: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("GenerationButtons Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("renders the Run button enabled and Result button disabled when not mutating and no data", () => {
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
    const resultButton = screen.getByTestId("result-button");

    expect(runButton).toBeInTheDocument();
    expect(runButton).toBeEnabled();
    expect(resultButton).toBeInTheDocument();
    expect(resultButton).toBeDisabled();
  });

  it("enables the Result button when data is available", () => {
    // Arrange
    (useGeneratorData as Mock).mockReturnValue({
      data: { parent2child_details: { group1: [{ sequence: "ATGC" }] } },
      snapshot: null,
      isMutating: false,
      generate: vi.fn(),
      cancel: vi.fn(),
    });

    // Act
    render(<GenerationButtons />);

    // Assert
    const resultButton = screen.getByTestId("result-button");
    expect(resultButton).toBeEnabled();
  });

  it("calls generate and shows loading toast when Run button is clicked", async () => {
    // Arrange
    const mockGenerate = vi.fn().mockResolvedValue(undefined);
    const mockCancel = vi.fn();
    (useGeneratorData as Mock).mockReturnValue({
      data: null,
      snapshot: null,
      isMutating: false,
      generate: mockGenerate,
      cancel: mockCancel,
    });

    (toast.loading as Mock).mockReturnValue("toast-id");

    // Act
    render(<GenerationButtons />);
    const runButton = screen.getByTestId("run-button");
    await userEvent.click(runButton);

    // Assert
    expect(mockGenerate).toHaveBeenCalled();
    expect(toast.loading).toHaveBeenCalled();
  });

  it("calls cancel when Cancel action in toast is clicked", async () => {
    // Arrange
    const mockGenerate = vi.fn().mockResolvedValue(undefined);
    const mockCancel = vi.fn();
    (useGeneratorData as Mock).mockReturnValue({
      data: null,
      snapshot: null,
      isMutating: false,
      generate: mockGenerate,
      cancel: mockCancel,
    });

    (toast.loading as Mock).mockReturnValue("toast-id");

    // Act
    render(<GenerationButtons />);
    const runButton = screen.getByTestId("run-button");
    await userEvent.click(runButton);
    const toastLoadingCall = (toast.loading as Mock).mock.calls[0];
    const toastLoadingAction = toastLoadingCall[1].action;
    act(() => {
      toastLoadingAction.onClick({ preventDefault: () => {} });
    });

    // Assert
    expect(mockCancel).toHaveBeenCalled();
  });

  it("shows success toast with View Result action when generate succeeds", async () => {
    // Arrange
    const mockGenerate = vi.fn().mockResolvedValue(undefined);
    const mockCancel = vi.fn();
    (useGeneratorData as Mock).mockReturnValue({
      data: { parent2child_details: { group1: [{ sequence: "ATGC" }] } },
      snapshot: null,
      isMutating: false,
      generate: mockGenerate,
      cancel: mockCancel,
    });

    (toast.loading as Mock).mockReturnValue("toast-id");

    // Act
    render(<GenerationButtons />);
    const runButton = screen.getByTestId("run-button");
    await userEvent.click(runButton);

    // Assert
    await waitFor(() => expect(mockGenerate).toHaveBeenCalled());
    expect(toast.success).toHaveBeenCalled();
  });

  it("opens the modal when View Result action in success toast is clicked", async () => {
    // Arrange
    const mockGenerate = vi.fn().mockResolvedValue(undefined);
    const mockCancel = vi.fn();
    (useGeneratorData as Mock).mockReturnValue({
      data: { parent2child_details: { group1: [{ sequence: "ATGC" }] } },
      snapshot: null,
      isMutating: false,
      generate: mockGenerate,
      cancel: mockCancel,
    });

    (toast.loading as Mock).mockReturnValue("toast-id");

    // Act
    render(<GenerationButtons />);
    const runButton = screen.getByTestId("run-button");
    await userEvent.click(runButton);
    await waitFor(() => expect(mockGenerate).toHaveBeenCalled());
    const toastSuccessCall = (toast.success as Mock).mock.calls[0];
    const toastSuccessAction = toastSuccessCall[1].action;
    act(() => {
      toastSuccessAction.onClick();
    });

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId("generation-result-modal")).toBeInTheDocument();
    });
  });

  it("opens the modal when Result button is clicked", async () => {
    // Arrange
    (useGeneratorData as Mock).mockReturnValue({
      data: { parent2child_details: { group1: [{ sequence: "ATGC" }] } },
      snapshot: null,
      isMutating: false,
      generate: vi.fn(),
      cancel: vi.fn(),
    });

    // Act
    render(<GenerationButtons />);
    const resultButton = screen.getByTestId("result-button");
    await userEvent.click(resultButton);

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId("generation-result-modal")).toBeInTheDocument();
    });
  });

  it("shows 'Generation canceled' toast when generation is canceled", async () => {
    // Arrange
    const mockGenerate = vi.fn().mockRejectedValue(new Error("Request was canceled"));
    const mockCancel = vi.fn();
    (useGeneratorData as Mock).mockReturnValue({
      data: null,
      snapshot: null,
      isMutating: false,
      generate: mockGenerate,
      cancel: mockCancel,
    });

    (toast.loading as Mock).mockReturnValue("toast-id");

    // Act
    render(<GenerationButtons />);
    const runButton = screen.getByTestId("run-button");
    await userEvent.click(runButton);

    // Assert
    await waitFor(() => expect(mockGenerate).toHaveBeenCalled());
    expect(toast.error).toHaveBeenCalled();
  });

  it("shows 'Generation failed' toast when generation fails", async () => {
    // Arrange
    const mockGenerate = vi.fn().mockRejectedValue(new Error("Some error"));
    const mockCancel = vi.fn();
    (useGeneratorData as Mock).mockReturnValue({
      data: null,
      snapshot: null,
      isMutating: false,
      generate: mockGenerate,
      cancel: mockCancel,
    });

    (toast.loading as Mock).mockReturnValue("toast-id");

    // Act
    render(<GenerationButtons />);
    const runButton = screen.getByTestId("run-button");
    await userEvent.click(runButton);

    // Assert
    await waitFor(() => expect(mockGenerate).toHaveBeenCalled());
    expect(toast.error).toHaveBeenCalled();
  });
});
