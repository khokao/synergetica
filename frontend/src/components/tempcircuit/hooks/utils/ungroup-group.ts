import { GROUP_NODE_MARGIN, NODE_HEIGHT, NODE_WIDTH } from "@/components/circuit/constants";
import { createParentNode } from "@/components/circuit/hooks/utils/create-node";
import type { Node } from "@xyflow/react";

export const ungroupNodes = (draft: Node[], parentNode: Node) => {
  if (!parentNode) {
    return;
  }

  draft.forEach((n) => {
    if (n.parentId === parentNode.id) {
      n.parentId = undefined;
      n.position.x += parentNode.position.x;
      n.position.y += parentNode.position.y;
    }
  });

  const parentIndex = draft.findIndex((n) => n.id === parentNode.id);
  if (parentIndex !== -1) draft.splice(parentIndex, 1);
};

export const groupNodes = (draft: Node[], nodesToGroup: Node[]) => {
  if (nodesToGroup.length < 2) {
    return;
  }

  const positions = nodesToGroup.map((n) => n.position);
  const minX = Math.min(...positions.map((pos) => pos.x));
  const minY = Math.min(...positions.map((pos) => pos.y));
  const maxX = Math.max(...positions.map((pos) => pos.x + NODE_WIDTH));
  const maxY = Math.max(...positions.map((pos) => pos.y + NODE_HEIGHT));

  const parentX = minX - GROUP_NODE_MARGIN;
  const parentY = minY - GROUP_NODE_MARGIN;
  const parentWidth = maxX - minX + GROUP_NODE_MARGIN * 2;
  const parentHeight = maxY - minY + GROUP_NODE_MARGIN * 2;

  const newParentNode = createParentNode({ x: parentX, y: parentY }, parentWidth, parentHeight);
  draft.unshift(newParentNode);

  draft.forEach((n) => {
    if (nodesToGroup.includes(n)) {
      n.parentId = newParentNode.id;
      n.position.x = n.position.x - parentX;
      n.position.y = n.position.y - parentY;
    }
  });
};
