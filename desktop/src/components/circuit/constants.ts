import { AnnotationEdge } from "@/components/circuit/edges/annotation-edge";
import { ConnectionEdge } from "@/components/circuit/edges/connection-edge";
import { CustomChildNode } from "@/components/circuit/nodes/child-node";
import { CustomParentNode } from "@/components/circuit/nodes/parent-node";
import { RiText } from "@remixicon/react";
import type { EdgeTypes, NodeTypes } from "@xyflow/react";
import { CornerUpRight, RectangleHorizontal } from "lucide-react";

export const TEMP_NODE_ID = "temp";
export const TEMP_EDGE_ID = "temp";

export const CircuitNodeTypes: NodeTypes = {
  child: CustomChildNode,
  parent: CustomParentNode,
};

export const CircuitEdgeTypes: EdgeTypes = {
  connection: ConnectionEdge,
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

export const CATEGORY_CONFIG = {
  Promoter: {
    icon: CornerUpRight,
    iconColor: "text-promoter-800",
    backgroundColor: "bg-promoter-200",
    underlineColor: "border-promoter-800",
    highlightColor: "text-promoter-600",
  },
  Protein: {
    icon: RectangleHorizontal,
    iconColor: "text-protein-800",
    backgroundColor: "bg-protein-200",
    underlineColor: "border-protein-800",
    highlightColor: "text-protein-600",
  },
  Terminator: {
    icon: RiText,
    iconColor: "text-terminator-800",
    backgroundColor: "bg-terminator-200",
    underlineColor: "border-terminator-800",
    highlightColor: "text-terminator-600",
  },
};
