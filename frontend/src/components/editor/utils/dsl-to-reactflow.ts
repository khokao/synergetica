import { EDGE_LENGTH, GROUP_NODE_MARGIN, NODE_HEIGHT, NODE_WIDTH } from "@/components/circuit/constants";
import { createEdge } from "@/components/circuit/hooks/utils/create-edge";
import { createChildNode, createParentNode } from "@/components/circuit/hooks/utils/create-node";
import { PARTS_NAME2ATTRIBUTES } from "@/components/circuit/nodes/constants";
import { CHAIN_GAP_Y, CHAIN_OFFSET_X } from "@/components/editor/constants";
import { looseCircuitSchema } from "@/components/editor/schemas/looseSchema";
import type { Edge, Node } from "@xyflow/react";
import { produce } from "immer";
import { parseDocument } from "yaml";

export const dslToReactflow = (content: string): { nodes: Node[]; edges: Edge[] } | null => {
  const doc = parseDocument(content);

  if (doc.contents === null) {
    return { nodes: [], edges: [] };
  }

  const dsl = doc.toJS();
  const result = looseCircuitSchema.safeParse(dsl);

  if (!result.success) {
    return null;
  }

  const { nodes, edges } = produce({ nodes: [] as Node[], edges: [] as Edge[] }, (draft) => {
    for (const [chainIndex, chainObj] of dsl.entries()) {
      const chain = chainObj.chain;
      const hasParent = chain.length > 1;

      const parentWidth = NODE_WIDTH * chain.length + EDGE_LENGTH * (chain.length - 1) + 2 * GROUP_NODE_MARGIN;
      const parentHeight = NODE_HEIGHT + 2 * GROUP_NODE_MARGIN;
      const parentPosition = {
        x: chainIndex * CHAIN_OFFSET_X,
        y: chainIndex * (NODE_HEIGHT + CHAIN_GAP_Y),
      };
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

          if (childObj.name in PARTS_NAME2ATTRIBUTES) {
            const attributes = PARTS_NAME2ATTRIBUTES[childObj.name];
            childDraft.data.description = attributes.description;
            childDraft.data.nodeSubcategory = attributes.nodeSubcategory;
            childDraft.data.sequence = attributes.sequence;
            childDraft.data.partsId = attributes.partsId;
            childDraft.data.controlBy = attributes.controlBy;
            childDraft.data.controlTo = attributes.controlTo;
            childDraft.data.meta = attributes.meta;
          }

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

  return { nodes, edges };
};
