import { useReactFlow } from "@xyflow/react";
import type { Node, Edge } from "@xyflow/react";
import { produce } from "immer";
import { useCallback } from "react";
import { EDGE_LENGTH } from "@/components/Circuit/constants";
import { getConnectedComponents } from "@/components/Circuit/utils/connected-components"
import { groupNodes, ungroupNodes } from "@/components/Circuit/utils/group-nodes";

export const useDeleteNodesEdges = () => {
  const reactflow = useReactFlow();

  const disconnectHandles = (draft: Node[], deletedEdges: Edge[]) => {
    deletedEdges.forEach((edge) => {
      const sourceNode = draft.find((node) => node.id === edge.source);
      const targetNode = draft.find((node) => node.id === edge.target);

      if (sourceNode) sourceNode.data.rightHandleConnected = false;
      if (targetNode) targetNode.data.leftHandleConnected = false;
    });
  };

  const regroupNodes = (draft: Node[], parentNodeId: string | undefined, allEdges: Edge[]) => {
    const parentNode = draft.find((node) => node.id === parentNodeId);
    if (!parentNode) return;

    const siblingNodes = draft.filter((node) => node.parentId === parentNode.id);

    ungroupNodes(draft, parentNode);

    const connectedComponents = getConnectedComponents(siblingNodes, allEdges);
    connectedComponents.forEach((component) => {
      groupNodes(draft, component);
    });
  };

  const regroupNodesOnNodeDelete = (draft: Node[], deletedNode: Node, allEdges: Edge[]) => {
    regroupNodes(draft, deletedNode.parentId, allEdges);
  };

  const regroupNodesOnEdgeDelete = (draft: Node[], deletedEdge: Edge, allEdges: Edge[]) => {
    const remainingEdges = allEdges.filter((edge) => edge.id !== deletedEdge.id);

    const sourceNode = draft.find((node) => node.id === deletedEdge.source);
    const targetNode = draft.find((node) => node.id === deletedEdge.target);

    if (sourceNode) regroupNodes(draft, sourceNode.parentId, remainingEdges);
    if (targetNode) regroupNodes(draft, targetNode.parentId, remainingEdges);
  };

  const handleDelete = useCallback(
    ({ nodes: deletedNodes, edges: deletedEdges }: { nodes: Node[]; edges: Edge[] }) => {
      const { getNodes, getEdges, setNodes } = reactflow;

      const allNodes = getNodes();
      const allEdges = getEdges();

      const newNodes = produce(allNodes, (draft) => {
        disconnectHandles(draft, deletedEdges);

        deletedNodes.forEach((node) => {
          if (node.parentId) {
            regroupNodesOnNodeDelete(draft, node, allEdges);
          }
        });

        deletedEdges.forEach((edge) => {
          regroupNodesOnEdgeDelete(draft, edge, allEdges);
        });
      });

      setNodes(newNodes);
    },
    [reactflow]
  );

  return {
    handleDelete,
  };
};
