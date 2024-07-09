import { getLeftHandlePosition, getRightHandlePosition } from "@/components/GUI/utils/getHandlePosition";
import type { Node } from "reactflow";
import { describe, expect, it } from "vitest";

describe("getHandlePosition utility functions", () => {
  const parentNode: Node = {
    id: "parent",
    type: "parent",
    position: { x: 100, y: 100 },
    width: 200,
    height: 200,
    data: {},
  };
  const childNode: Node = {
    id: "child",
    type: "child",
    position: { x: 50, y: 50 },
    width: 50,
    height: 50,
    data: {
      leftHandleStyle: { top: 10, left: 20 },
      rightHandleStyle: { top: 10, left: 30 },
    },
  };

  describe("getLeftHandlePosition", () => {
    it("should return correct position when parent node is defined", () => {
      const expectedPosition = {
        x: parentNode.position.x + childNode.position.x + childNode.data.leftHandleStyle.left,
        y: parentNode.position.y + childNode.position.y + childNode.data.leftHandleStyle.top,
      };

      const result = getLeftHandlePosition(childNode, parentNode);

      expect(result).toEqual(expectedPosition);
    });

    it("should return correct position when parent node is not defined", () => {
      const expectedPosition = {
        x: childNode.position.x + childNode.data.leftHandleStyle.left,
        y: childNode.position.y + childNode.data.leftHandleStyle.top,
      };

      const result = getLeftHandlePosition(childNode, null);

      expect(result).toEqual(expectedPosition);
    });
  });

  describe("getRightHandlePosition", () => {
    it("should return correct position when parent node is defined", () => {
      const expectedPosition = {
        x: parentNode.position.x + childNode.position.x + childNode.data.rightHandleStyle.left,
        y: parentNode.position.y + childNode.position.y + childNode.data.rightHandleStyle.top,
      };

      const result = getRightHandlePosition(childNode, parentNode);

      expect(result).toEqual(expectedPosition);
    });

    it("should return correct position when parent node is not defined", () => {
      const expectedPosition = {
        x: childNode.position.x + childNode.data.rightHandleStyle.left,
        y: childNode.position.y + childNode.data.rightHandleStyle.top,
      };

      const result = getRightHandlePosition(childNode, null);

      expect(result).toEqual(expectedPosition);
    });
  });
});
