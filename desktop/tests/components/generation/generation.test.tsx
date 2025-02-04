import { GenerationButtons } from "@/components/generation/generation";
import { useGenerator } from "@/components/generation/hooks/use-generator";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { toast } from "sonner";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/circuit/parts/parts-context", () => {
  const promoterParts = {
    PromoterA: {
      name: "PromoterA",
      description: "PromoterA Description",
      category: "Promoter",
      controlBy: [],
    },
  };
  const proteinParts = {
    ProteinA: {
      name: "ProteinA",
      description: "ProteinA Description",
      category: "Protein",
      controlBy: [],
    },
  };
  const terminatorParts = {
    TerminatorA: {
      name: "TerminatorA",
      description: "TerminatorA Description",
      category: "Terminator",
      controlBy: [],
    },
  };

  return {
    useParts: () => ({
      promoterParts: promoterParts,
      proteinParts: proteinParts,
      terminatorParts: terminatorParts,
    }),
  };
});

vi.mock("@/components/editor/editor-context", () => ({
  useEditorContext: () => ({
    setEditorContent: vi.fn(),
  }),
}));

vi.mock("@/components/generation/hooks/use-generator", () => ({
  useGenerator: vi.fn(),
}));

describe("GenerationButtons Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("renders the Run button enabled and Result button disabled when not mutating and no data", () => {
    // Arrange
    vi.mocked(useGenerator).mockReturnValue({
      generate: vi.fn(),
      cancel: vi.fn(),
      isGenerating: false,
    });

    // Act
    render(<GenerationButtons />);

    // Assert
    const runButton = screen.getByTestId("generation-run-button");
    const resultButton = screen.getByTestId("generation-result-button");

    expect(runButton).toBeInTheDocument();
    expect(runButton).toBeEnabled();
    expect(resultButton).toBeInTheDocument();
    expect(resultButton).toBeDisabled();
  });

  it("enables the Result button when data is available", async () => {
    // Arrange
    const mockGenerate = vi.fn().mockResolvedValue({
      snapshot: { nodes: [] },
      response: { protein_generated_sequences: {} },
    });
    vi.mocked(useGenerator).mockReturnValue({
      generate: mockGenerate,
      cancel: vi.fn(),
      isGenerating: false,
    });

    render(<GenerationButtons />);

    // Act
    const runButton = screen.getByTestId("generation-run-button");
    await userEvent.click(runButton);

    // Assert
    await waitFor(() => {
      expect(mockGenerate).toHaveBeenCalled();
      expect(screen.getByTestId("generation-result-button")).toBeEnabled();
    });
  });

  it("calls cancel when Cancel action in toast is clicked", async () => {
    // Arrange
    const mockCancel = vi.fn();
    const mockGenerate = vi.fn().mockResolvedValue({
      snapshot: { nodes: [] },
      response: { protein_generated_sequences: {} },
    });
    vi.mocked(useGenerator).mockReturnValue({
      generate: mockGenerate,
      cancel: mockCancel,
      isGenerating: false,
    });

    const toastLoadingSpy = vi.spyOn(toast, "loading").mockImplementation(() => "toastId");

    render(<GenerationButtons />);

    // Act
    await userEvent.click(screen.getByTestId("generation-run-button"));
    await waitFor(() => expect(mockGenerate).toHaveBeenCalled());

    const [[, options]] = toastLoadingSpy.mock.calls;
    // @ts-ignore
    const { action } = options;
    act(() => {
      action.onClick({ preventDefault: vi.fn() });
    });

    // Assert
    expect(mockCancel).toHaveBeenCalled();
  });

  it("shows success toast with View Result action when generate succeeds", async () => {
    // Arrange
    const mockGenerate = vi.fn().mockResolvedValue({
      snapshot: { nodes: [] },
      response: { protein_generated_sequences: {} },
    });
    vi.mocked(useGenerator).mockReturnValue({
      generate: mockGenerate,
      cancel: vi.fn(),
      isGenerating: false,
    });

    const toastSuccessSpy = vi.spyOn(toast, "success");

    render(<GenerationButtons />);

    // Act
    await userEvent.click(screen.getByTestId("generation-run-button"));

    // Assert
    await waitFor(() => {
      expect(toastSuccessSpy).toHaveBeenCalledWith(
        "Generation successful",
        expect.objectContaining({
          id: expect.anything(),
          action: expect.any(Object),
        }),
      );
    });
  });

  it("opens the modal when View Result action in success toast is clicked", async () => {
    // Arrange
    const mockGenerate = vi.fn().mockResolvedValue({
      snapshot: { nodes: [] },
      response: { protein_generated_sequences: {} },
    });
    vi.mocked(useGenerator).mockReturnValue({
      generate: mockGenerate,
      cancel: vi.fn(),
      isGenerating: false,
    });

    const toastSuccessSpy = vi.spyOn(toast, "success").mockImplementation(() => "toastSuccessId");

    render(<GenerationButtons />);

    // Act
    await userEvent.click(screen.getByTestId("generation-run-button"));
    await waitFor(() => expect(mockGenerate).toHaveBeenCalled());

    const [[, options]] = toastSuccessSpy.mock.calls;
    // @ts-ignore
    const { action } = options;
    act(() => {
      action.onClick();
    });

    // Assert
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("opens the modal when Result button is clicked", async () => {
    // Arrange
    const mockGenerate = vi.fn().mockResolvedValue({
      snapshot: { nodes: [] },
      response: { protein_generated_sequences: {} },
    });
    vi.mocked(useGenerator).mockReturnValue({
      generate: mockGenerate,
      cancel: vi.fn(),
      isGenerating: false,
    });

    render(<GenerationButtons />);

    await userEvent.click(screen.getByTestId("generation-run-button"));
    await waitFor(() => expect(screen.getByTestId("generation-result-button")).toBeEnabled());

    // Act
    await userEvent.click(screen.getByTestId("generation-result-button"));

    // Assert
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("shows 'Generation canceled' toast when generation is canceled", async () => {
    // Arrange
    const mockGenerate = vi.fn().mockRejectedValue({ message: "Request was canceled" });
    vi.mocked(useGenerator).mockReturnValue({
      generate: mockGenerate,
      cancel: vi.fn(),
      isGenerating: false,
    });

    const toastErrorSpy = vi.spyOn(toast, "error");

    render(<GenerationButtons />);

    // Act
    await userEvent.click(screen.getByTestId("generation-run-button"));

    // Assert
    await waitFor(() => {
      expect(mockGenerate).toHaveBeenCalled();
      expect(toastErrorSpy).toHaveBeenCalledWith(
        "Generation canceled",
        expect.objectContaining({
          id: expect.anything(),
          action: expect.any(Object),
        }),
      );
    });
  });

  it("shows 'Generation failed' toast when generation fails", async () => {
    // Arrange
    const mockGenerate = vi.fn().mockRejectedValue(new Error("Some other error"));
    vi.mocked(useGenerator).mockReturnValue({
      generate: mockGenerate,
      cancel: vi.fn(),
      isGenerating: false,
    });

    const toastErrorSpy = vi.spyOn(toast, "error");

    render(<GenerationButtons />);

    // Act
    await userEvent.click(screen.getByTestId("generation-run-button"));

    // Assert
    await waitFor(() => {
      expect(mockGenerate).toHaveBeenCalled();
      expect(toastErrorSpy).toHaveBeenCalledWith(
        "Generation failed",
        expect.objectContaining({
          id: expect.anything(),
          action: expect.any(Object),
        }),
      );
    });
  });

  it("processes nodes array correctly to produce chain sequences", async () => {
    // Arrange
    const user = userEvent.setup();

    const mockGenerate = vi.fn().mockResolvedValue({
      snapshot: {
        nodes: [
          {
            id: "parent-1",
            type: "parent",
            data: {},
            position: { x: 0, y: 0 },
          },
          {
            id: "child-1",
            parentId: "parent-1",
            type: "child",
            data: { sequence: "A", category: "Promoter" },
            position: { x: 100, y: 0 },
          },
          {
            id: "child-2",
            parentId: "parent-1",
            type: "child",
            data: { sequence: "A", category: "Protein" },
            position: { x: 200, y: 0 },
          },
          {
            id: "child-3",
            parentId: "parent-1",
            type: "child",
            data: { sequence: "A", category: "Protein" },
            position: { x: 300, y: 0 },
          },
          {
            id: "child-3",
            parentId: "parent-1",
            type: "child",
            data: { sequence: "A", category: "Terminator" },
            position: { x: 400, y: 0 },
          },
        ],
        proteinParameters: {
          "child-2": 10,
          "child-3": 20,
        },
      },
      response: {
        protein_generated_sequences: {
          "child-2": "TT",
          "child-3": "CC",
        },
      },
    });

    vi.mocked(useGenerator).mockReturnValue({
      generate: mockGenerate,
      cancel: vi.fn(),
      isGenerating: false,
    });

    // Act
    render(<GenerationButtons />);
    await user.click(screen.getByTestId("generation-run-button"));
    await user.click(screen.getByTestId("generation-result-button"));

    // Assert
    await waitFor(() => {
      // Promoter + RBS + Protein + RBS + Protein + Terminator
      expect(screen.getByTestId("sequence-preview")).toHaveTextContent("ATTACCAA");
    });
  });
});
