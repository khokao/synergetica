import { wrapTailNode } from "@/components/GUI/nodes/wrapTailNode";
import icon from "@public/images/node-wrap-tail.svg";
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("wrapTailNode", () => {
  it("should render wrapTailNode with correct image and attributes", () => {
    const { getByAltText } = render(wrapTailNode);

    const img = getByAltText("wrapTail");

    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", icon.src);
  });

  it("should set draggable and call onDragStart on drag start", () => {
    const mockDragEvent = { dataTransfer: { setData: vi.fn(), effectAllowed: "" }, preventDefault: vi.fn() };
    const { container } = render(wrapTailNode);
    const div = container.firstChild as HTMLDivElement;

    fireEvent.mouseDown(div);
    fireEvent.dragStart(div, mockDragEvent);

    expect(div).toHaveAttribute("draggable", "true");
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith("application/reactflow-node-type", "wrapTail");
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "application/reactflow-icon-url",
      "/images/node-wrap-tail.svg",
    );
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "application/reactflow-left-handle-style",
      JSON.stringify({ top: 15, left: 5 }),
    );
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "application/reactflow-right-handle-style",
      JSON.stringify({ top: 15, left: 16 }),
    );
    expect(mockDragEvent.dataTransfer.effectAllowed).toBe("move");
  });
});
