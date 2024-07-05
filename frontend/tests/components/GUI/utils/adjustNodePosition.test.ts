import { adjustSourceNodePosition, adjustTargetNodePosition } from "@/components/GUI/utils/adjustNodePosition";
import type { Node, XYPosition } from "reactflow";
import { describe, expect, it } from "vitest";

describe("adjustNodePosition", () => {
  describe("adjusttNodePosition without parentNode", () => {
    // Arrange
    const sourceNode: Node = {
      id: "1",
      type: "source",
      position: { x: 50, y: 50 },
      data: {
        leftHandleStyle: { top: 25, left: 0 },
        rightHandleStyle: { top: 25, left: 100 },
      },
      width: 100,
      height: 50,
    };
    const targetNode: Node = {
      id: "2",
      type: "target",
      position: { x: 200, y: 200 },
      data: {
        leftHandleStyle: { top: 50, left: 0 },
        rightHandleStyle: { top: 50, left: 50 },
      },
      width: 50,
      height: 100,
    };
    const parentNode = null;

    it("should correctly adjust target node position based on source node without source parent node", () => {
      const adjustedTargetNodePosition: XYPosition = adjustTargetNodePosition(sourceNode, targetNode, parentNode);

      expect(adjustedTargetNodePosition).toEqual({ x: 150, y: 25 });
    });

    it("should correctly adjust source node position based on target node without target parent node", () => {
      const adjustedSourceNodePosition: XYPosition = adjustSourceNodePosition(sourceNode, targetNode, parentNode);

      expect(adjustedSourceNodePosition).toEqual({ x: 100, y: 225 });
    });
  });
});
