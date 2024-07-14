import { Bottombar } from "@/components/GUI/Bottombar";
import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

describe("Bottombar", () => {
  it("should render all nodes", () => {
    render(<Bottombar />);

    expect(screen.getByAltText("promoter")).toBeInTheDocument();
    expect(screen.getByAltText("protein")).toBeInTheDocument();
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
      expect(mockDataTransfer.setData).toHaveBeenCalledWith(
        "application/reactflow-icon-url",
        "/images/node-promoter.svg",
      );
      expect(mockDataTransfer.setData).toHaveBeenCalledWith("application/reactflow-node-category", "promoter");
      expect(mockDataTransfer.setData).toHaveBeenCalledWith(
        "application/reactflow-left-handle-style",
        JSON.stringify({ top: 68, left: 5 }),
      );
      expect(mockDataTransfer.setData).toHaveBeenCalledWith(
        "application/reactflow-right-handle-style",
        JSON.stringify({ top: 68, left: 180 }),
      );
      expect(mockDataTransfer.setData).toHaveBeenCalledWith(
        "application/reactflow-command-palette-button-style",
        JSON.stringify({ top: 47, left: 11, right: 10 }),
      );
      expect(mockDataTransfer.setData).toHaveBeenCalledWith(
        "application/reactflow-command-palette-options",
        JSON.stringify([
          {
            name: "PameR",
            description: "Regulated Promoter repressed by AmeR",
            subcategory: "RepressivePromoter",
            repressedBy: "AmeR",
            repressTo: undefined,
          },
          {
            name: "PamtR",
            description: "Regulated Promoter repressed by AmtR",
            subcategory: "RepressivePromoter",
            repressedBy: "AmtR",
            repressTo: undefined,
          },
          {
            name: "Pbetl",
            description: "Regulated Promoter repressed by BetI",
            subcategory: "RepressivePromoter",
            repressedBy: "BetI",
            repressTo: undefined,
          },
          {
            name: "Pbm3r1",
            description: "Regulated Promoter repressed by BM3R1",
            subcategory: "RepressivePromoter",
            repressedBy: "BM3R1",
            repressTo: undefined,
          },
          {
            name: "PhyllR",
            description: "Regulated Promoters repressed by HylIR",
            subcategory: "RepressivePromoter",
            repressedBy: "HlyIIR",
            repressTo: undefined,
          },
          {
            name: "PlcaRA",
            description: "Regulated Promoters repressed by LcaRA",
            subcategory: "RepressivePromoter",
            repressedBy: "IcaRA",
            repressTo: undefined,
          },
          {
            name: "PlitR",
            description: "Regulated Promoter repressed by LitR",
            subcategory: "RepressivePromoter",
            repressedBy: "LitR",
            repressTo: undefined,
          },
          {
            name: "PlmrA",
            description: "Regulated Promoter repressed by LmrA",
            subcategory: "RepressivePromoter",
            repressedBy: "LmrA",
            repressTo: undefined,
          },
          {
            name: "PphlF",
            description: "Regulated Promoter repressed by PhlF",
            subcategory: "RepressivePromoter",
            repressedBy: "PhlF",
            repressTo: undefined,
          },
          {
            name: "PpsrA",
            description: "Regulated Promoter repressed by PsrA",
            subcategory: "RepressivePromoter",
            repressedBy: "PsrA",
            repressTo: undefined,
          },
          {
            name: "PqacR",
            description: "Regulated Promoter repressed by QacR",
            subcategory: "RepressivePromoter",
            repressedBy: "QacR",
            repressTo: undefined,
          },
          {
            name: "PsrpR",
            description: "Regulated Promoter repressed by SrpR",
            subcategory: "RepressivePromoter",
            repressedBy: "SrpR",
            repressTo: undefined,
          },
        ]),
      );
      expect(mockDataTransfer.effectAllowed).toBe("move");
    } else {
      throw new Error("Node element not found");
    }
  });
});
