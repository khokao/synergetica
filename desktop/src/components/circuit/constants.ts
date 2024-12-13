import { AnnotationEdge } from "@/components/circuit/edges/annotation-edge";
import { CustomEdge } from "@/components/circuit/edges/custom-edge";
import { CustomChildNode } from "@/components/circuit/nodes/child-node";
import { CustomParentNode } from "@/components/circuit/nodes/parent-node";
import type { EdgeTypes, NodeTypes } from "@xyflow/react";

export const TEMP_NODE_ID = "temp";
export const TEMP_EDGE_ID = "temp";

export const CircuitNodeTypes: NodeTypes = {
  child: CustomChildNode,
  parent: CustomParentNode,
};

export const CircuitEdgeTypes: EdgeTypes = {
  custom: CustomEdge,
  annotation: AnnotationEdge,
};

export const NODE_WIDTH = 180;
export const NODE_HEIGHT = 126;

export const EDGE_LENGTH = 50;
export const NODE_CONNECT_DISTANCE = 150;
export const GROUP_NODE_MARGIN = 20;

export const ANNOTATION_HANDLE_OFFSET = 30;
export const ANNOTATION_BEZIER_OFFSET = 120;
export const REPRESSION_COLOR = "#818cf8"; // indigo-400
export const ACTIVATION_COLOR = "#f87171"; // red-400
