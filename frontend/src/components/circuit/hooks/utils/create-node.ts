import { NODE_HEIGHT, NODE_WIDTH } from "@/components/circuit/constants";
import type { Node, XYPosition } from "@xyflow/react";
import { humanId } from "human-id";

export const createChildNode = (position: XYPosition, nodeCategory): Node => ({
  id: humanId({ separator: "-", capitalize: false }),
  type: "child",
  position,
  width: NODE_WIDTH,
  height: NODE_HEIGHT,
  data: {
    nodeCategory: nodeCategory,
    nodePartsName: undefined,
    description: undefined,
    nodeSubcategory: undefined,
    sequence: undefined,
    controlBy: null,
    controlTo: null,
    meta: null,
    leftHandleConnected: false,
    rightHandleConnected: false,
    simulationTargetHighlight: undefined,
    showParentId: false,
  },
});

export const createTempNode = (position: XYPosition, nodeCategory): Node => {
  const node = createChildNode(position, nodeCategory);
  node.id = "temp";
  node.selected = true;
  return node;
};

export const createParentNode = (position: XYPosition, width, height): Node => ({
  id: humanId({ separator: "-", capitalize: false }),
  type: "parent",
  position: position,
  width: width,
  height: height,
  data: {},
  className: "!z-0", // Hack to make the edges to appear above the parent node.
});
