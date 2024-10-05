import { NODE_HEIGHT, NODE_WIDTH } from "@/components/circuit/constants";
import type { Edge, Node, XYPosition } from "@xyflow/react";

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

export const findRelatedNodes = (nodes: Node[], edge: Edge) => {
  const sourceNode = nodes.find((n) => n.id === edge.source);
  const targetNode = nodes.find((n) => n.id === edge.target);

  const parentNode = nodes.find((n) => n.id === sourceNode.parentId || n.id === targetNode.parentId);
  const siblingNodes = parentNode ? nodes.filter((n) => n.parentId === parentNode.id) : [];

  return { sourceNode, targetNode, parentNode, siblingNodes };
};

export const isNodeOutsideParent = (childNode: Node, parentNode: Node): boolean => {
  const px = parentNode.position.x;
  const py = parentNode.position.y;
  const pw = parentNode.width;
  const ph = parentNode.height;
  const cx = px + childNode.position.x;
  const cy = py + childNode.position.y;
  const cw = NODE_WIDTH;
  const ch = NODE_HEIGHT;
  return cx + cw <= px || cx >= px + pw || cy + ch <= py || cy >= py + ph;
};
