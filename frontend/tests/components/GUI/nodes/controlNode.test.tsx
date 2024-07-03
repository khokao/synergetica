import { controlNode } from "@/components/GUI/nodes/controlNode";
import icon from "@public/images/node-control.svg";
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("controlNode", () => {
  it("should render controlNode with correct image and attributes", () => {
    const { getByAltText } = render(controlNode);

    const img = getByAltText("control");

    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", icon.src);
  });

  it("should set draggable and call onDragStart on drag start", () => {
    const mockDragEvent = { dataTransfer: { setData: vi.fn(), effectAllowed: "" }, preventDefault: vi.fn() };
    const { container } = render(controlNode);
    const div = container.firstChild as HTMLDivElement;

    fireEvent.mouseDown(div);
    fireEvent.dragStart(div, mockDragEvent);

    expect(div).toHaveAttribute("draggable", "true");
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith("application/reactflow-node-type", "control");
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "application/reactflow-icon-url",
      "/images/node-control.svg",
    );
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "application/reactflow-left-handle-style",
      JSON.stringify({ top: 15, left: 7 }),
    );
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "application/reactflow-right-handle-style",
      JSON.stringify({ top: 15, left: 178 }),
    );
    expect(mockDragEvent.dataTransfer.effectAllowed).toBe("move");
  });
});
