import type { Node, XYPosition } from "reactflow";

export const getLeftHandlePosition = (childNode: Node, parentNode: Node): XYPosition => {
  if (!parentNode) {
    return {
      x: childNode.position.x + childNode.data.leftHandleStyle.left,
      y: childNode.position.y + childNode.data.leftHandleStyle.top,
    };
  }
  return {
    x: parentNode.position.x + childNode.position.x + childNode.data.leftHandleStyle.left,
    y: parentNode.position.y + childNode.position.y + childNode.data.leftHandleStyle.top,
  };
};

export const getRightHandlePosition = (childNode: Node, parentNode: Node): XYPosition => {
  if (!parentNode) {
    return {
      x: childNode.position.x + childNode.data.rightHandleStyle.left,
      y: childNode.position.y + childNode.data.rightHandleStyle.top,
    };
  }
  return {
    x: parentNode.position.x + childNode.position.x + childNode.data.rightHandleStyle.left,
    y: parentNode.position.y + childNode.position.y + childNode.data.rightHandleStyle.top,
  };
};
