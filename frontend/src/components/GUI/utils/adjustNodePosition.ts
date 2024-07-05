import { getLeftHandlePosition, getRightHandlePosition } from "@/components/GUI/utils/getHandlePosition";
import type { Node, XYPosition } from "reactflow";

export const adjustTargetNodePosition = (
  sourceNode: Node,
  targetNode: Node,
  sourceParentNode: Node | null,
): XYPosition => {
  const sourceNodeRightHandlePosition = getRightHandlePosition(sourceNode, sourceParentNode);
  const position = {
    x: sourceNodeRightHandlePosition.x - targetNode.data.leftHandleStyle.left,
    y: sourceNodeRightHandlePosition.y - targetNode.data.leftHandleStyle.top,
  };
  return position;
};

export const adjustSourceNodePosition = (
  sourceNode: Node,
  targetNode: Node,
  targetParentNode: Node | null,
): XYPosition => {
  const targetNodeLeftHandlePosition = getLeftHandlePosition(targetNode, targetParentNode);
  const position = {
    x: targetNodeLeftHandlePosition.x - sourceNode.data.rightHandleStyle.left,
    y: targetNodeLeftHandlePosition.y - sourceNode.data.rightHandleStyle.top,
  };
  return position;
};
