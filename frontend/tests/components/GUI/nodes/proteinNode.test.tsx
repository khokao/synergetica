import { proteinNode } from "@/components/GUI/nodes/proteinNode";
import icon from "@public/images/node-protein.svg";
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("proteinNode", () => {
  it("should render proteinNode with correct image and attributes", () => {
    const { getByAltText } = render(proteinNode);

    const img = getByAltText("protein");

    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", icon.src);
  });

  it("should set draggable and call onDragStart on drag start", () => {
    const mockDragEvent = { dataTransfer: { setData: vi.fn(), effectAllowed: "" }, preventDefault: vi.fn() };
    const { container } = render(proteinNode);
    const div = container.firstChild as HTMLDivElement;

    fireEvent.mouseDown(div);
    fireEvent.dragStart(div, mockDragEvent);

    expect(div).toHaveAttribute("draggable", "true");
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "application/reactflow-icon-url",
      "/images/node-protein.svg",
    );
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith("application/reactflow-node-category", "protein");
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "application/reactflow-left-handle-style",
      JSON.stringify({ top: 15, left: 6 }),
    );
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "application/reactflow-right-handle-style",
      JSON.stringify({ top: 15, left: 178 }),
    );
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "application/reactflow-command-palette-button-style",
      JSON.stringify({ top: -6, left: 12, right: 30 }),
    );
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "application/reactflow-command-palette-options",
      JSON.stringify([
        {
          name: "AmeR",
          description: "Repressor Protein of PameR",
          subcategory: "RepressorProtein",
          repressedBy: undefined,
          repressTo: "PameR",
        },
        {
          name: "AmtR",
          description: "Repressor Protein of PamtR",
          subcategory: "RepressorProtein",
          repressedBy: undefined,
          repressTo: "PamtR",
        },
        {
          name: "BetI",
          description: "Repressor Protein of Betl",
          subcategory: "RepressorProtein",
          repressedBy: undefined,
          repressTo: "Pbetl",
        },
        {
          name: "BM3R1",
          description: "Repressor Protein of Pbm3R1",
          subcategory: "RepressorProtein",
          repressedBy: undefined,
          repressTo: "Pbm3r1",
        },
        {
          name: "HlyIIR",
          description: "Repressor Protein of PhyllR",
          subcategory: "RepressorProtein",
          repressedBy: undefined,
          repressTo: "PhyllR",
        },
        {
          name: "IcaRA",
          description: "Repressor Protein of PlcaRA",
          subcategory: "RepressorProtein",
          repressedBy: undefined,
          repressTo: "PlcaRA",
        },
        {
          name: "LitR",
          description: "Repressor Protein of PlitR",
          subcategory: "RepressorProtein",
          repressedBy: undefined,
          repressTo: "PlitR",
        },
        {
          name: "LmrA",
          description: "Repressor Protein of PlmrA",
          subcategory: "RepressorProtein",
          repressedBy: undefined,
          repressTo: "PlmrA",
        },
        {
          name: "PhlF",
          description: "Repressor Protein of PphlF",
          subcategory: "RepressorProtein",
          repressedBy: undefined,
          repressTo: "PphlF",
        },
        {
          name: "PsrA",
          description: "Repressor Protein of PpsrA",
          subcategory: "RepressorProtein",
          repressedBy: undefined,
          repressTo: "PpsrA",
        },
        {
          name: "QacR",
          description: "Repressor Protein of PqacR",
          subcategory: "RepressorProtein",
          repressedBy: undefined,
          repressTo: "PqacR",
        },
        {
          name: "SrpR",
          description: "Repressor Protein of PsrpR",
          subcategory: "RepressorProtein",
          repressedBy: undefined,
          repressTo: "PsrpR",
        },
      ]),
    );

    expect(mockDragEvent.dataTransfer.effectAllowed).toBe("move");
  });
});
