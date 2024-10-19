import { getConnectedComponents } from "@/components/circuit/hooks/utils/connected-components";
import { groupNodes, ungroupNodes } from "@/components/circuit/hooks/utils/ungroup-group";
import { useReactFlow } from "@xyflow/react";
import type { Edge, Node } from "@xyflow/react";
import { produce } from "immer";
import { useCallback } from "react";

export const useDeleteNodesEdges = () => {
  const reactflow = useReactFlow();

  const disconnectHandles = useCallback((draft: Node[], deletedEdges: Edge[]) => {
    for (const edge of deletedEdges) {
      const sourceNode = draft.find((node) => node.id === edge.source);
      const targetNode = draft.find((node) => node.id === edge.target);

      if (sourceNode) sourceNode.data.rightHandleConnected = false;
      if (targetNode) targetNode.data.leftHandleConnected = false;
    }
  }, []);

  const regroupNodes = useCallback((draft: Node[], parentNodeId: string | undefined, allEdges: Edge[]) => {
    const parentNode = draft.find((node) => node.id === parentNodeId);
    if (!parentNode) return;

    const siblingNodes = draft.filter((node) => node.parentId === parentNode.id);

    ungroupNodes(draft, parentNode);

    const connectedComponents = getConnectedComponents(siblingNodes, allEdges);
    for (const component of connectedComponents) {
      groupNodes(draft, component);
    }
  }, []);

  const regroupNodesOnNodeDelete = useCallback(
    (draft: Node[], deletedNode: Node, allEdges: Edge[]) => {
      regroupNodes(draft, deletedNode.parentId, allEdges);
    },
    [regroupNodes],
  );

  const regroupNodesOnEdgeDelete = useCallback(
    (draft: Node[], deletedEdge: Edge, allEdges: Edge[]) => {
      const remainingEdges = allEdges.filter((edge) => edge.id !== deletedEdge.id);

      const sourceNode = draft.find((node) => node.id === deletedEdge.source);
      const targetNode = draft.find((node) => node.id === deletedEdge.target);

      if (sourceNode) regroupNodes(draft, sourceNode.parentId, remainingEdges);
      if (targetNode) regroupNodes(draft, targetNode.parentId, remainingEdges);
    },
    [regroupNodes],
  );

  const handleDelete = useCallback(
    ({ nodes: deletedNodes, edges: deletedEdges }: { nodes: Node[]; edges: Edge[] }) => {
      const { getNodes, getEdges, setNodes } = reactflow;

      const allNodes = getNodes();
      const allEdges = getEdges();

      const newNodes = produce(allNodes, (draft) => {
        disconnectHandles(draft, deletedEdges);

        for (const node of deletedNodes) {
          if (node.parentId) {
            regroupNodesOnNodeDelete(draft, node, allEdges);
          }
        }

        for (const edge of deletedEdges) {
          regroupNodesOnEdgeDelete(draft, edge, allEdges);
        }
      });

      setNodes(newNodes);
    },
    [reactflow, disconnectHandles, regroupNodesOnNodeDelete, regroupNodesOnEdgeDelete],
  );

  return {
    handleDelete,
  };
};
