import { visibleNode } from "@/components/GUI/nodes/visibleNode";
import icon from "@public/images/node-visible.svg";
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("visibleNode", () => {
  it("should render visibleNode with correct image and attributes", () => {
    const { getByAltText } = render(visibleNode);

    const img = getByAltText("visible");

    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", icon.src);
  });

  it("should set draggable and call onDragStart on drag start", () => {
    const mockDragEvent = { dataTransfer: { setData: vi.fn(), effectAllowed: "" }, preventDefault: vi.fn() };
    const { container } = render(visibleNode);
    const div = container.firstChild as HTMLDivElement;

    fireEvent.mouseDown(div);
    fireEvent.dragStart(div, mockDragEvent);

    expect(div).toHaveAttribute("draggable", "true");
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith("application/reactflow-node-type", "visible");
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "application/reactflow-icon-url",
      "/images/node-visible.svg",
    );
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "application/reactflow-left-handle-style",
      JSON.stringify({ top: 15, left: 6 }),
    );
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "application/reactflow-right-handle-style",
      JSON.stringify({ top: 15, left: 178 }),
    );
    expect(mockDragEvent.dataTransfer.effectAllowed).toBe("move");
  });
});
