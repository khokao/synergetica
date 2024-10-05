import { EDGE_LENGTH, NODE_HEIGHT, NODE_WIDTH } from "@/components/circuit/constants";
import { getLeftHandlePosition, getRightHandlePosition } from "@/components/circuit/hooks/utils/utils";
import type { Node, XYPosition } from "@xyflow/react";

export const adjustNodePositionsAndConnectHandles = (
  adjustedNode: Node,
  sourceNode: Node,
  targetNode: Node,
  parentNode: Node | undefined,
) => {
  if (adjustedNode.id === sourceNode.id) {
    sourceNode.position = adjustSourceNodePosition(targetNode, parentNode);
  } else {
    targetNode.position = adjustTargetNodePosition(sourceNode, parentNode);
  }
  sourceNode.data.rightHandleConnected = true;
  targetNode.data.leftHandleConnected = true;
};

const adjustTargetNodePosition = (sourceNode: Node, sourceParentNode: Node | null): XYPosition => {
  const sourceNodeRightHandlePosition = getRightHandlePosition(sourceNode, sourceParentNode);
  const position = {
    x: sourceNodeRightHandlePosition.x + EDGE_LENGTH,
    y: sourceNodeRightHandlePosition.y - NODE_HEIGHT / 2,
  };
  return position;
};

const adjustSourceNodePosition = (targetNode: Node, targetParentNode: Node | null): XYPosition => {
  const targetNodeLeftHandlePosition = getLeftHandlePosition(targetNode, targetParentNode);
  const position = {
    x: targetNodeLeftHandlePosition.x - NODE_WIDTH - EDGE_LENGTH,
    y: targetNodeLeftHandlePosition.y - NODE_HEIGHT / 2,
  };
  return position;
};
