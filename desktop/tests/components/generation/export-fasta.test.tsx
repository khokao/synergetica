import { ExportFastaButton } from "@/components/generation/export-fasta";
import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@tauri-apps/plugin-dialog", () => ({
  save: vi.fn(),
}));

vi.mock("@tauri-apps/plugin-fs", () => ({
  writeTextFile: vi.fn(),
}));

describe("ExportButton Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the ExportFastaButton and handles click event", async () => {
    // Arrange
    const chainSequences = {
      "parent-1": "AAATTT",
      "parent-2": "CCCGGG",
    };
    vi.mocked(save).mockResolvedValue("/path/to/sequence.fasta");
    vi.mocked(writeTextFile).mockResolvedValue();

    render(<ExportFastaButton chainSequences={chainSequences} />);

    // Act
    fireEvent.click(screen.getByText("Export FASTA"));

    // Assert
    await waitFor(() => {
      expect(save).toHaveBeenCalled();
      expect(writeTextFile).toHaveBeenCalledWith("/path/to/sequence.fasta", "> parent-1\nAAATTT\n> parent-2\nCCCGGG");
    });
  });

  it("does not call writeTextFile if save is canceled", async () => {
    // Arrange
    const chainSequences = {
      "parent-1": "AAATTT",
      "parent-2": "CCCGGG",
    };
    vi.mocked(save).mockResolvedValue(null); // Cancel
    vi.mocked(writeTextFile).mockResolvedValue();

    render(<ExportFastaButton chainSequences={chainSequences} />);

    // Act
    fireEvent.click(screen.getByText("Export FASTA"));

    // Assert
    await waitFor(() => {
      expect(save).toHaveBeenCalled();
      expect(writeTextFile).not.toHaveBeenCalled();
    });
  });
});
