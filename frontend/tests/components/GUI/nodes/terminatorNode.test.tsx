import { terminatorNode } from "@/components/GUI/nodes/terminatorNode";
import icon from "@public/images/node-terminator.svg";
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("terminatorNode", () => {
  it("should render terminatorNode with correct image and attributes", () => {
    const { getByAltText } = render(terminatorNode);

    const img = getByAltText("terminator");

    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", icon.src);
  });

  it("should set draggable and call onDragStart on drag start", () => {
    const mockDragEvent = { dataTransfer: { setData: vi.fn(), effectAllowed: "" }, preventDefault: vi.fn() };
    const { container } = render(terminatorNode);
    const div = container.firstChild as HTMLDivElement;

    fireEvent.mouseDown(div);
    fireEvent.dragStart(div, mockDragEvent);

    expect(div).toHaveAttribute("draggable", "true");
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "application/reactflow-icon-url",
      "/images/node-terminator.svg",
    );
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "application/reactflow-node-category",
      "terminator",
    );
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "application/reactflow-left-handle-style",
      JSON.stringify({ top: 63, left: 5 }),
    );
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "application/reactflow-right-handle-style",
      JSON.stringify({ top: 63, left: 180 }),
    );
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "application/reactflow-command-palette-button-style",
      JSON.stringify({ top: 42, left: 11, right: 10 }),
    );

    expect(mockDragEvent.dataTransfer.effectAllowed).toBe("move");
  });
});
