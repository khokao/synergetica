import { getLeftHandlePosition, getRightHandlePosition } from "@/components/GUI/utils/getHandlePosition";
import { nanoid } from "nanoid";

const calculateDistance = (position1, position2) => {
  const dx = position1.x - position2.x;
  const dy = position1.y - position2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const calculateDistanceBetweenHandles = (sourceNode, targetNode, sourceParentNode, targetParentNode) => {
  if (sourceNode.data.rightHandleConnected || targetNode.data.leftHandleConnected) {
    return Number.MAX_VALUE;
  }

  const sourceNodeRightHandlePosition = getRightHandlePosition(sourceNode, sourceParentNode);
  const targetNodeLeftHandlePosition = getLeftHandlePosition(targetNode, targetParentNode);
  return calculateDistance(sourceNodeRightHandlePosition, targetNodeLeftHandlePosition);
};

const findNearestNode = (node, nds, isFromLeftHandle) => {
  const MIN_DISTANCE = 150;

  const parentNode = nds.find((n) => n.id === node.parentId);

  let nearestNode = null;
  let nearestNodeDistance = Number.MAX_VALUE;

  for (const n of nds) {
    if (n.id !== node.id && n.type === node.type) {
      const pn = nds.find((nn) => nn.id === n.parentId);
      const distance = isFromLeftHandle
        ? calculateDistanceBetweenHandles(n, node, pn, parentNode)
        : calculateDistanceBetweenHandles(node, n, parentNode, pn);

      if (distance < nearestNodeDistance && distance < MIN_DISTANCE) {
        nearestNode = n;
        nearestNodeDistance = distance;
      }
    }
  }

  return { nearestNode, nearestNodeDistance };
};

export const createNearestEdge = (node, nds) => {
  const nearestSource = findNearestNode(node, nds, true);
  const nearestTarget = findNearestNode(node, nds, false);

  if (nearestSource.nearestNode && nearestSource.nearestNodeDistance <= nearestTarget.nearestNodeDistance) {
    return {
      id: nanoid(),
      source: nearestSource.nearestNode.id,
      target: node.id,
      style: { strokeWidth: 4 },
      data: { draggedNodeIsTarget: true },
    };
  }

  if (nearestTarget.nearestNode) {
    return {
      id: nanoid(),
      source: node.id,
      target: nearestTarget.nearestNode.id,
      style: { strokeWidth: 4 },
      data: { draggedNodeIsTarget: false },
    };
  }

  return null;
};

export const addNearestEdge = (node, nds, eds) => {
  const nearestEdge = createNearestEdge(node, nds);
  if (nearestEdge) {
    return [...eds, nearestEdge];
  }
  return eds;
};
