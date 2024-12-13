import { ExportButton } from "@/components/generation/export-button";
import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { type Mock, describe, expect, it, vi } from "vitest";

vi.mock("@tauri-apps/plugin-dialog", () => ({
  save: vi.fn(),
}));

vi.mock("@tauri-apps/plugin-fs", () => ({
  writeTextFile: vi.fn(),
}));

describe("ExportButton Component", () => {
  it("renders the ExportButton and handles click event", async () => {
    // Arrange
    const mockData = {
      parent2child_details: {
        group1: [{ sequence: "ATGC" }, { sequence: "CGTA" }],
        group2: [{ sequence: "GCTA" }],
      },
    };
    const mockSave = vi.fn().mockResolvedValue("/path/to/sequence.fasta");
    const mockWriteTextFile = vi.fn();

    (save as Mock).mockImplementation(mockSave);
    (writeTextFile as Mock).mockImplementation(mockWriteTextFile);

    render(<ExportButton data={mockData} />);

    // Act
    fireEvent.click(screen.getByText("Export FASTA"));

    // Assert
    await waitFor(() => {
      expect(mockSave).toHaveBeenCalled();
      expect(mockWriteTextFile).toHaveBeenCalledWith("/path/to/sequence.fasta", "> group1\nATGCCGTA\n\n> group2\nGCTA");
    });
  });

  it("does not call writeTextFile if save is canceled", async () => {
    // Arrange
    const mockData = {
      parent2child_details: {
        group1: [{ sequence: "ATGC" }],
      },
    };
    const mockSave = vi.fn().mockResolvedValue(null); // cancel
    const mockWriteTextFile = vi.fn();

    (save as Mock).mockImplementation(mockSave);
    (writeTextFile as Mock).mockImplementation(mockWriteTextFile);

    render(<ExportButton data={mockData} />);

    // Act
    fireEvent.click(screen.getByText("Export FASTA"));

    // Assert
    await waitFor(() => {
      expect(mockSave).toHaveBeenCalled();
      expect(mockWriteTextFile).not.toHaveBeenCalled();
    });
  });
});
