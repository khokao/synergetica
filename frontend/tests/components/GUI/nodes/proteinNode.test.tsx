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
      "application/reactflow-node-subcategory",
      expect.anything(),
    );
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "application/reactflow-left-handle-style",
      JSON.stringify({ top: 15, left: 6 }),
    );
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "application/reactflow-right-handle-style",
      JSON.stringify({ top: 15, left: 178 }),
    );
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "application/reactflow-select-menu-style",
      JSON.stringify({ top: -6, left: 12, right: 30 }),
    );
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "application/reactflow-select-menu-options",
      JSON.stringify([
        { name: "protein subtype 1", description: "protein subtype 1 description" },
        { name: "protein subtype 2", description: "protein subtype 2 description" },
      ]),
    );
    expect(mockDragEvent.dataTransfer.effectAllowed).toBe("move");
  });
});
