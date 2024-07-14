import { promoterNode } from "@/components/GUI/nodes/promoterNode";
import icon from "@public/images/node-promoter.svg";
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("promoterNode", () => {
  it("should render promoterNode with correct image and attributes", () => {
    const { getByAltText } = render(promoterNode);

    const img = getByAltText("promoter");

    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", icon.src);
  });

  it("should set draggable and call onDragStart on drag start", () => {
    const mockDragEvent = { dataTransfer: { setData: vi.fn(), effectAllowed: "" }, preventDefault: vi.fn() };
    const { container } = render(promoterNode);
    const div = container.firstChild as HTMLDivElement;

    fireEvent.mouseDown(div);
    fireEvent.dragStart(div, mockDragEvent);

    expect(div).toHaveAttribute("draggable", "true");
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "application/reactflow-icon-url",
      "/images/node-promoter.svg",
    );
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith("application/reactflow-node-category", "promoter");
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "application/reactflow-left-handle-style",
      JSON.stringify({ top: 68, left: 5 }),
    );
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "application/reactflow-right-handle-style",
      JSON.stringify({ top: 68, left: 180 }),
    );
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "application/reactflow-command-palette-button-style",
      JSON.stringify({ top: 47, left: 11, right: 10 }),
    );
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
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
    expect(mockDragEvent.dataTransfer.effectAllowed).toBe("move");
  });
});
