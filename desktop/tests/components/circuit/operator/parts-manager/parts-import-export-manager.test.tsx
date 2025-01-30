import { PartsImportExportManager } from "@/components/circuit/operator/parts-manager/parts-import-export-manager";
import { TooltipProvider } from "@/components/ui/tooltip";
import * as dialog from "@tauri-apps/plugin-dialog";
import * as fs from "@tauri-apps/plugin-fs";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockSetParts = vi.fn();
const mockSetNodes = vi.fn();
const mockGetNodes = vi.fn().mockReturnValue([]);

const defaultParts = {
  PromoterA: {
    name: "PromoterA",
    description: "PromoterA Description",
    category: "Promoter",
    sequence: "ATGC",
    controlBy: [],
    params: {
      Ydef: 1.0,
    },
  },
};
vi.mock("@/components/circuit/parts/parts-context", () => ({
  useParts: () => ({
    parts: defaultParts,
    setParts: mockSetParts,
  }),
}));

vi.mock("@tauri-apps/plugin-dialog", () => ({
  open: vi.fn(),
  save: vi.fn(),
}));

vi.mock("@tauri-apps/plugin-fs", () => ({
  readTextFile: vi.fn(),
  writeTextFile: vi.fn(),
}));

vi.mock("@xyflow/react", () => ({
  useReactFlow: () => ({
    getNodes: mockGetNodes,
    setNodes: mockSetNodes,
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("PartsImportExportManager Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("handles successful import", async () => {
    // Arrange
    const user = userEvent.setup();
    const fileContent = JSON.stringify({
      TerminatorA: {
        name: "TerminatorA",
        description: "TerminatorA Description",
        category: "Terminator",
        sequence: "ATGC",
        controlBy: [],
        params: {},
      },
    });
    const openMock = vi.spyOn(dialog, "open").mockResolvedValue("path/to/file.json");
    const readTextFileMock = vi.spyOn(fs, "readTextFile").mockResolvedValue(fileContent);

    render(
      <TooltipProvider>
        <PartsImportExportManager />
      </TooltipProvider>,
    );

    // Act
    await user.click(screen.getByTestId("parts-import-button"));

    // Assert
    expect(openMock).toHaveBeenCalledWith({
      multiple: false,
      directory: false,
      filters: [
        {
          name: "JSON",
          extensions: ["json"],
        },
      ],
    });
    expect(readTextFileMock).toHaveBeenCalledWith("path/to/file.json");
    expect(mockSetNodes).toHaveBeenCalledWith([]);
    expect(mockSetParts).toHaveBeenCalledWith({
      TerminatorA: {
        name: "TerminatorA",
        description: "TerminatorA Description",
        category: "Terminator",
        sequence: "ATGC",
        controlBy: [],
        params: {},
      },
    });
    expect(toast.success).toHaveBeenCalled();
  });

  it("handles failed import", async () => {
    // Arrange
    const user = userEvent.setup();
    const openMock = vi.spyOn(dialog, "open").mockRejectedValue(new Error("Import failed"));

    render(
      <TooltipProvider>
        <PartsImportExportManager />
      </TooltipProvider>,
    );

    // Act
    await user.click(screen.getByTestId("parts-import-button"));

    // Assert
    await waitFor(() => {
      expect(openMock).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it("handles successful export", async () => {
    // Arrange
    const user = userEvent.setup();
    const saveMock = vi.spyOn(dialog, "save").mockResolvedValue("path/to/save.json");
    const writeTextFileMock = vi.spyOn(fs, "writeTextFile").mockResolvedValue();

    render(
      <TooltipProvider>
        <PartsImportExportManager />
      </TooltipProvider>,
    );

    // Act
    await user.click(screen.getByTestId("parts-export-button"));

    // Assert
    expect(saveMock).toHaveBeenCalledWith({
      filters: [{ name: "JSON", extensions: ["json"] }],
      defaultPath: "parts.json",
    });
    expect(writeTextFileMock).toHaveBeenCalledWith("path/to/save.json", JSON.stringify(defaultParts, null, 2));
    expect(toast.success).toHaveBeenCalled();
  });

  it("handles failed export", async () => {
    // Arrange
    const user = userEvent.setup();
    const saveMock = vi.spyOn(dialog, "save").mockRejectedValue(new Error("Export failed"));

    render(
      <TooltipProvider>
        <PartsImportExportManager />
      </TooltipProvider>,
    );

    // Act
    await user.click(screen.getByTestId("parts-export-button"));

    // Assert
    expect(saveMock).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalled();
  });
});
