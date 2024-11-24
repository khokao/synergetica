import { ACTIVATION_COLOR, REPRESSION_COLOR, TEMP_EDGE_ID } from "@/components/circuit/constants";
import type { Edge } from "@xyflow/react";
import { nanoid } from "nanoid";

export const createEdge = (sourceId: string, targetId: string): Edge => ({
  id: nanoid(),
  type: "custom",
  source: sourceId,
  target: targetId,
  sourceHandle: "right",
  targetHandle: "left",
  style: { strokeWidth: 4 },
  animated: false,
  zIndex: 10, // Hack to make the edges to appear above the parent node.
});

export const createRepressionEdge = (sourceId: string, targetId: string): Edge => ({
  id: nanoid(),
  type: "annotation",
  source: sourceId,
  target: targetId,
  style: { strokeWidth: 4, stroke: REPRESSION_COLOR },
  markerEnd: "repression",
  zIndex: 0,
  selectable: false,
});

export const createActivationEdge = (sourceId: string, targetId: string): Edge => ({
  id: nanoid(),
  type: "annotation",
  source: sourceId,
  target: targetId,
  style: { strokeWidth: 4, stroke: ACTIVATION_COLOR },
  markerEnd: "activation",
  zIndex: 0,
  selectable: false,
});

export const createTempEdge = (sourceId: string, targetId: string): Edge => {
  const edge = createEdge(sourceId, targetId);
  edge.id = TEMP_EDGE_ID;
  edge.animated = true;
  return edge;
};
