import { CustomEdge } from "@/components/circuit/edges/custom-edge";
import { CustomChildNode } from "@/components/circuit/nodes/child";
import { CustomParentNode } from "@/components/circuit/nodes/parent";
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

export const NODE_WIDTH = 200;
export const NODE_HEIGHT = 140;

export const EDGE_LENGTH = 50;
export const NODE_CONNECT_DISTANCE = 150;
export const GROUP_NODE_MARGIN = 30;
