import { TEMP_NODE_ID } from "@/components/circuit/constants";
import { useChangeSource } from "@/components/editor/editor-context";
import { useNodes } from "@xyflow/react";
import { useEffect } from "react";
import { stringify } from "yaml";

export const useCircuitToDsl = (setValue) => {
  const nodes = useNodes();
  const { changeSource } = useChangeSource();

  useEffect(() => {
    if (nodes.length === 0 || changeSource !== "circuit") {
      return;
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
          type: child.data.nodeCategory,
          name: child.data.nodePartsName,
        }));

      return {
        chain: children,
        positionY: parent.position.y,
      };
    });

    const singleChains = childNodesWithoutParent.map((child) => ({
      chain: [
        {
          type: child.data.nodeCategory,
          name: child.data.nodePartsName,
        },
      ],
      positionY: child.position.y,
    }));

    const chains = [...parentChains, ...singleChains]
      .sort((a, b) => a.positionY - b.positionY)
      .map(({ chain }) => ({ chain }));

    const dsl = { circuit: chains };

    setValue(stringify(dsl));
  }, [nodes, setValue, changeSource]);
};
