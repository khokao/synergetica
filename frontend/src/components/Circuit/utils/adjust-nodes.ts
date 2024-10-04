import type { XYPosition, Node } from "@xyflow/react";
import { getLeftHandlePosition, getRightHandlePosition } from "@/components/Circuit/utils/handle-position";
import { NODE_WIDTH, NODE_HEIGHT, EDGE_LENGTH } from "@/components/Circuit/constants";


export const adjustNodePositionsAndConnectHandles = (
  adjustedNode: Node,
  sourceNode: Node,
  targetNode: Node,
  parentNode: Node | undefined
) => {
  if (adjustedNode.id === sourceNode.id) {
    sourceNode.position = adjustSourceNodePosition(targetNode, parentNode);
  } else {
    targetNode.position = adjustTargetNodePosition(sourceNode, parentNode);
  }
  sourceNode.data.rightHandleConnected = true;
  targetNode.data.leftHandleConnected = true;
};


export const adjustTargetNodePosition = (
  sourceNode: Node,
  sourceParentNode: Node | null,
): XYPosition => {
  const sourceNodeRightHandlePosition = getRightHandlePosition(sourceNode, sourceParentNode);
  const position = {
    x: sourceNodeRightHandlePosition.x + EDGE_LENGTH,
    y: sourceNodeRightHandlePosition.y - NODE_HEIGHT / 2,
  };
  return position;
};

export const adjustSourceNodePosition = (
  targetNode: Node,
  targetParentNode: Node | null,
): XYPosition => {
  const targetNodeLeftHandlePosition = getLeftHandlePosition(targetNode, targetParentNode);
  const position = {
    x: targetNodeLeftHandlePosition.x - NODE_WIDTH - EDGE_LENGTH,
    y: targetNodeLeftHandlePosition.y - NODE_HEIGHT / 2,
  };
  return position;
};
