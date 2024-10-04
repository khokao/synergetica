import { nanoid } from "nanoid";
import type { Edge } from "@xyflow/react";
import { TEMP_EDGE_ID } from "@/components/Circuit/constants";


export const createEdge = (sourceId: string, targetId: string): Edge => (
  {
    id: nanoid(),
    type: "custom",
    source: sourceId,
    target: targetId,
    style: { strokeWidth: 4 },
    animated: false,
    zIndex: 10,
  }
);


export const createTempEdge = (sourceId: string, targetId: string): Edge => {
  const edge = createEdge(sourceId, targetId);
  edge.id = TEMP_EDGE_ID;
  edge.animated = true;
  return edge;
}
