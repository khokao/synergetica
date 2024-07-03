import { recombinaseRecognitionSeqNode } from "@/components/GUI/nodes/recombinaseRecognitionSeqNode";
import icon from "@public/images/node-recombinase-recognition-seq.svg";
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("recombinaseRecognitionSeqNode", () => {
  it("should render recombinaseRecognitionSeqNode with correct image and attributes", () => {
    const { getByAltText } = render(recombinaseRecognitionSeqNode);

    const img = getByAltText("recombinaseRecognitionSeq");

    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", icon.src);
  });

  it("should set draggable and call onDragStart on drag start", () => {
    const mockDragEvent = { dataTransfer: { setData: vi.fn(), effectAllowed: "" }, preventDefault: vi.fn() };
    const { container } = render(recombinaseRecognitionSeqNode);
    const div = container.firstChild as HTMLDivElement;

    fireEvent.mouseDown(div);
    fireEvent.dragStart(div, mockDragEvent);

    expect(div).toHaveAttribute("draggable", "true");
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "application/reactflow-node-type",
      "recombinaseRecognitionSeq",
    );
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "application/reactflow-icon-url",
      "/images/node-recombinase-recognition-seq.svg",
    );
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "application/reactflow-left-handle-style",
      JSON.stringify({ top: 45, left: 4 }),
    );
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "application/reactflow-right-handle-style",
      JSON.stringify({ top: 45, left: 127 }),
    );
    expect(mockDragEvent.dataTransfer.effectAllowed).toBe("move");
  });
});
