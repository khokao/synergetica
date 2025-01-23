import { TEMP_NODE_ID } from "@/components/circuit/constants";
import { INDENT_SIZE } from "@/components/editor/constants";
import type { Node } from "@xyflow/react";
import { stringify } from "yaml";

export const reactflowToDsl = (nodes: Node[]): string => {
  if (nodes.length === 0) {
    return "";
  }

  const parentNodes = nodes.filter((node) => node.type === "parent" && node.id !== TEMP_NODE_ID);
  const childNodes = nodes.filter((node) => node.type === "child" && node.id !== TEMP_NODE_ID);

  const childNodesWithParent = childNodes.filter((child) => child.parentId);
  const childNodesWithoutParent = childNodes.filter((child) => !child.parentId);

  const parentChains = parentNodes.map((parent) => {
    const children = childNodesWithParent
      .filter((child) => child.parentId === parent.id)
      .sort((a, b) => a.position.x - b.position.x)
      .map((child) => ({
        type: child.data.category,
        name: child.data.name,
      }));

    return {
      chain: children,
      positionY: parent.position.y,
    };
  });

  const singleChains = childNodesWithoutParent.map((child) => ({
    chain: [
      {
        type: child.data.category,
        name: child.data.name,
      },
    ],
    positionY: child.position.y,
  }));

  const chains = [...parentChains, ...singleChains]
    .sort((a, b) => a.positionY - b.positionY)
    .map(({ chain }) => ({ chain }));

  const content = stringify(chains, { indent: INDENT_SIZE, indentSeq: false });
  return content;
};
