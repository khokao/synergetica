import { NODE_HEIGHT, NODE_WIDTH } from "@/components/circuit/constants";
import type { Node, XYPosition } from "@xyflow/react";
import { humanId } from "human-id";
import { nanoid } from "nanoid";

export const createChildNode = (position: XYPosition, category): Node => ({
  id: nanoid(),
  type: "child",
  position,
  width: NODE_WIDTH,
  height: NODE_HEIGHT,
  data: {
    category: category,
    name: "",
    description: "",
    sequence: "",
    controlBy: [],
    controlTo: [],
    meta: null,
    leftHandleConnected: false,
    rightHandleConnected: false,
    simulationTargetHighlight: undefined,
    showParentId: false,
  },
});

export const createTempNode = (position: XYPosition, category): Node => {
  const node = createChildNode(position, category);
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
