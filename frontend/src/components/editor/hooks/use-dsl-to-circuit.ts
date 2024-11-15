import { EDGE_LENGTH, GROUP_NODE_MARGIN, NODE_HEIGHT, NODE_WIDTH } from "@/components/circuit/constants";
import { createEdge } from "@/components/circuit/hooks/utils/create-edge";
import { createChildNode, createParentNode } from "@/components/circuit/hooks/utils/create-node";
import { PARTS_NAME2ATTRIBUTES } from "@/components/circuit/nodes/constants";
import { looseCircuitSchema } from "@/components/editor/schema";
import { getNodesBounds, useReactFlow } from "@xyflow/react";
import type { Edge, Node } from "@xyflow/react";
import { produce } from "immer";
import { useEffect } from "react";
import { parseDocument } from "yaml";

export const useDslToCircuit = (value: string) => {
  const { setNodes, setEdges, fitBounds } = useReactFlow();

  useEffect(() => {
    const doc = parseDocument(value);

    if (doc.contents === null) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const dsl = doc.toJS();
    const result = looseCircuitSchema.safeParse(dsl);

    if (!result.success) {
      return;
    }

    const { nodes, edges } = produce({ nodes: [] as Node[], edges: [] as Edge[] }, (draft) => {
      for (const [chainIndex, chainObj] of dsl.circuit.entries()) {
        const chain = chainObj.chain;
        const hasParent = chain.length > 1;

        const parentWidth = NODE_WIDTH * chain.length + EDGE_LENGTH * (chain.length - 1) + 2 * GROUP_NODE_MARGIN;
        const parentHeight = NODE_HEIGHT + 2 * GROUP_NODE_MARGIN;
        const parentPosition = { x: 0, y: chainIndex * (NODE_HEIGHT + 3 * GROUP_NODE_MARGIN) };
        const parentNode = createParentNode(parentPosition, parentWidth, parentHeight);

        if (hasParent) {
          draft.nodes.push(parentNode);
        }

        let previousChildNodeId: string | null = null;

        for (const [childIndex, childObj] of chain.entries()) {
          const childPosition = hasParent
            ? {
                x: GROUP_NODE_MARGIN + childIndex * (NODE_WIDTH + EDGE_LENGTH),
                y: GROUP_NODE_MARGIN,
              }
            : {
                x: parentPosition.x + GROUP_NODE_MARGIN + childIndex * (NODE_WIDTH + EDGE_LENGTH),
                y: parentPosition.y + GROUP_NODE_MARGIN,
              };
          const nodeCategory = childObj.type;
          const tempChildNode = createChildNode(childPosition, nodeCategory);

          const childNode = produce(tempChildNode, (childDraft) => {
            childDraft.parentId = hasParent ? parentNode.id : undefined;
            childDraft.data.nodePartsName = childObj.name;

            const attributes = PARTS_NAME2ATTRIBUTES[childObj.name];
            childDraft.data.description = attributes.description;
            childDraft.data.nodeSubcategory = attributes.nodeSubcategory;
            childDraft.data.sequence = attributes.sequence;
            childDraft.data.partsId = attributes.partsId;
            childDraft.data.controlBy = attributes.controlBy;
            childDraft.data.controlTo = attributes.controlTo;
            childDraft.data.meta = attributes.meta;

            if (previousChildNodeId) {
              childDraft.data.leftHandleConnected = true;
            }
          });

          draft.nodes.push(childNode);

          if (previousChildNodeId) {
            const edge = createEdge(previousChildNodeId, childNode.id);
            draft.edges.push(edge);

            const prevNodeIndex = draft.nodes.findIndex((node) => node.id === previousChildNodeId);
            if (prevNodeIndex !== -1) {
              draft.nodes[prevNodeIndex] = produce(draft.nodes[prevNodeIndex], (prevNodeDraft) => {
                prevNodeDraft.data.rightHandleConnected = true;
              });
            }
          }

          previousChildNodeId = childNode.id;
        }
      }
    });

    setNodes(nodes);
    setEdges(edges);

    // NOTE: `getNodesBounds` from the `useReactFlow` hook is not working as expected, but it shows warning:
    // "Please use `getNodesBounds` from `useReactFlow`/`useSvelteFlow` hook to ensure correct values for sub flows.
    // If not possible, you have to provide a nodeLookup to support sub flows."
    console.warn = (m, ...a) => m.includes("Please use `getNodesBounds` from") || console.warn(m, ...a);
    const bounds = getNodesBounds(nodes);
    fitBounds(bounds, { padding: 0.5 });
  }, [value, setNodes, setEdges, fitBounds]);
};
