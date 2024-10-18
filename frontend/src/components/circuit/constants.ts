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
};

export const NODE_WIDTH = 180;
export const NODE_HEIGHT = 126;

export const EDGE_LENGTH = 50;
export const NODE_CONNECT_DISTANCE = 150;
export const GROUP_NODE_MARGIN = 20;
