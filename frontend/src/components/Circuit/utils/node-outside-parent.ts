import { NODE_WIDTH, NODE_HEIGHT } from "@/components/Circuit/constants";
import type { Node } from "@xyflow/react";

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
