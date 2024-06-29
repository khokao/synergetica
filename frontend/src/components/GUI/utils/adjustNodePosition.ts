import { getLeftHandlePosition, getRightHandlePosition } from "@/components/GUI/utils/getHandlePosition";

export const adjustTargetNodePosition = (sourceNode, targetNode, sourceParentNode) => {
  const sourceNodeRightHandlePosition = getRightHandlePosition(sourceNode, sourceParentNode);
  const position = {
    x: sourceNodeRightHandlePosition.x - targetNode.data.leftHandleStyle.left,
    y: sourceNodeRightHandlePosition.y - targetNode.data.leftHandleStyle.top,
  };
  return position;
};

export const adjustSourceNodePosition = (sourceNode, targetNode, targetParentNode) => {
  const targetNodeLeftHandlePosition = getLeftHandlePosition(targetNode, targetParentNode);
  const position = {
    x: targetNodeLeftHandlePosition.x - sourceNode.data.rightHandleStyle.left,
    y: targetNodeLeftHandlePosition.y - sourceNode.data.rightHandleStyle.top,
  };
  return position;
};
