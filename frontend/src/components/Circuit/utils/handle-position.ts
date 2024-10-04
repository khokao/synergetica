import type { XYPosition, Node } from "@xyflow/react";
import { NODE_WIDTH, NODE_HEIGHT } from "@/components/Circuit/constants";

export const getLeftHandlePosition = (childNode: Node, parentNode: Node): XYPosition => {
  if (!parentNode) {
    return {
      x: childNode.position.x,
      y: childNode.position.y + NODE_HEIGHT / 2,
    };
  }
  return {
    x: parentNode.position.x + childNode.position.x,
    y: parentNode.position.y + childNode.position.y + NODE_HEIGHT / 2,
  };
};

export const getRightHandlePosition = (childNode: Node, parentNode: Node): XYPosition => {
  if (!parentNode) {
    return {
      x: childNode.position.x + NODE_WIDTH,
      y: childNode.position.y + NODE_HEIGHT / 2,
    };
  }
  return {
    x: parentNode.position.x + childNode.position.x + NODE_WIDTH,
    y: parentNode.position.y + childNode.position.y + NODE_HEIGHT / 2,
  };
};
