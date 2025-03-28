import { NODE_CONNECT_DISTANCE } from "@/components/circuit/constants";
import { createEdge } from "@/components/circuit/hooks/utils/create-edge";
import { getLeftHandlePosition, getRightHandlePosition } from "@/components/circuit/hooks/utils/utils";
import type { Edge, Node, XYPosition } from "@xyflow/react";

const calculateDistance = (position1: XYPosition, position2: XYPosition): number => {
  const dx = position1.x - position2.x;
  const dy = position1.y - position2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const calculateDistanceBetweenHandles = (
  sourceNode: Node,
  targetNode: Node,
  sourceParentNode: Node | null,
  targetParentNode: Node | null,
): number => {
  if (sourceNode.data.rightHandleConnected || targetNode.data.leftHandleConnected) {
    return Number.MAX_VALUE;
  }

  const sourceNodeRightHandlePosition = getRightHandlePosition(sourceNode, sourceParentNode);
  const targetNodeLeftHandlePosition = getLeftHandlePosition(targetNode, targetParentNode);
  return calculateDistance(sourceNodeRightHandlePosition, targetNodeLeftHandlePosition);
};

const findNearestNode = (
  node: Node,
  nds: Node[],
  isFromLeftHandle: boolean,
): { nearestNode: Node | null; nearestNodeDistance: number } => {
  const parentNode = nds.find((n) => n.id === node.parentId);

  let nearestNode: Node | null = null;
  let nearestNodeDistance = Number.MAX_VALUE;

  for (const n of nds) {
    if (n.id !== node.id && n.type === node.type) {
      const pn = nds.find((nn) => nn.id === n.parentId);

      const distance = isFromLeftHandle
        ? calculateDistanceBetweenHandles(n, node, pn ?? null, parentNode ?? null)
        : calculateDistanceBetweenHandles(node, n, parentNode ?? null, pn ?? null);

      if (distance < nearestNodeDistance && distance < NODE_CONNECT_DISTANCE) {
        nearestNode = n;
        nearestNodeDistance = distance;
      }
    }
  }

  return { nearestNode, nearestNodeDistance };
};

export const createNearestEdge = (sourceNode: Node, targetNode: Node, nds: Node[]): Edge | null => {
  const nearestSource = findNearestNode(targetNode, nds, true);
  const nearestTarget = findNearestNode(sourceNode, nds, false);

  if (nearestSource.nearestNode && nearestSource.nearestNodeDistance <= nearestTarget.nearestNodeDistance) {
    return createEdge(nearestSource.nearestNode.id, targetNode.id);
  }

  if (nearestTarget.nearestNode) {
    return createEdge(sourceNode.id, nearestTarget.nearestNode.id);
  }

  return null;
};
