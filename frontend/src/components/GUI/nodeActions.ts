import { adjustSourceNodePosition, adjustTargetNodePosition } from "@/components/GUI/utils/adjustNodePosition";
import {
  activateConnectedEdgesAnimation,
  deactivateConnectedEdgesAnimation,
} from "@/components/GUI/utils/animateConnectedEdges";
import { addNearestEdge, createNearestEdge } from "@/components/GUI/utils/createNearestEdge";
import { divideNodesByEdges } from "@/components/GUI/utils/divideNodesByEdges";
import { groupNodes, ungroupNodes } from "@/components/GUI/utils/groupNodes";
import { isNodeOutsideParent } from "@/components/GUI/utils/isNodeOutsideParent";
import { nanoid } from "nanoid";
import type { Edge, Node, ReactFlowState, XYPosition } from "reactflow";
import type { StoreApi } from "zustand";

export const createChildNode = (
  position: XYPosition,
  iconUrl: string,
  nodeCategory: string,
  nodeSubcategory: string,
  leftHandleStyle: React.CSSProperties,
  rightHandleStyle: React.CSSProperties,
  selectMenuStyle: React.CSSProperties,
  selectMenuOptions: Array<Record<string, string>>,
): Node => ({
  id: nanoid(),
  type: "child",
  position,
  data: {
    iconUrl,
    nodeCategory,
    nodeSubcategory,
    leftHandleStyle,
    rightHandleStyle,
    selectMenuStyle,
    selectMenuOptions,
    leftHandleConnected: false,
    rightHandleConnected: false,
  },
});

export const dragChildNode = (
  node: Node,
  setEdges: (payload: Edge[] | ((edges: Edge[]) => Edge[])) => void,
  store: StoreApi<ReactFlowState>,
  dragStartConnectedEdges: React.MutableRefObject<Edge[] | null>,
): void => {
  const { nodeInternals } = store.getState();
  const storeNodes = Array.from(nodeInternals.values());

  if (node.parentId) {
    const parentNode = storeNodes.find((n) => n.id === node.parentId);
    if (!isNodeOutsideParent(node, parentNode)) {
      setEdges((eds) => {
        return [
          ...eds.filter((e) => e.source !== node.id && e.target !== node.id),
          ...activateConnectedEdgesAnimation(dragStartConnectedEdges.current, node.id),
        ];
      });
      return;
    }
    setEdges((eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id));
    return;
  }

  setEdges((eds) => {
    return activateConnectedEdgesAnimation(
      addNearestEdge(
        node,
        storeNodes,
        eds.filter((e) => !e.animated),
      ),
      node.id,
    );
  });
};

export const stopDragChildNode = (
  node: Node,
  storeNodes: Node[],
  setEdges: (payload: Edge[] | ((edges: Edge[]) => Edge[])) => void,
  setNodes: (payload: Node[] | ((nodes: Node[]) => Node[])) => void,
  dragStartNode: React.MutableRefObject<Node | null>,
  dragStartConnectedEdges: React.MutableRefObject<Edge[] | null>,
): void => {
  if (!node.parentId) {
    stopDragNodeWithoutParent(node, storeNodes, setEdges, setNodes);
  } else {
    stopDragNodeWithParent(node, storeNodes, setEdges, setNodes, dragStartNode, dragStartConnectedEdges);
  }
};

const stopDragNodeWithoutParent = (
  node: Node,
  storeNodes: Node[],
  setEdges: (payload: Edge[] | ((edges: Edge[]) => Edge[])) => void,
  setNodes: (payload: Node[] | ((nodes: Node[]) => Node[])) => void,
): void => {
  const nearestEdge = createNearestEdge(node, storeNodes);

  if (!nearestEdge) {
    return;
  }

  setEdges((eds) => deactivateConnectedEdgesAnimation(eds, node.id));

  setNodes((nds) => {
    const draggedNodeIsTarget = nearestEdge.data.draggedNodeIsTarget;

    const sourceNode = nds.find((n) => n.id === nearestEdge.source);
    const targetNode = nds.find((n) => n.id === nearestEdge.target);
    const parentNode = draggedNodeIsTarget
      ? nds.find((n) => n.id === sourceNode.parentId)
      : nds.find((n) => n.id === targetNode.parentId);
    const siblingNodes = parentNode ? nds.filter((n) => n.parentId === parentNode.id) : [];

    if (draggedNodeIsTarget) {
      targetNode.position = adjustTargetNodePosition(sourceNode, targetNode, parentNode);
    } else {
      sourceNode.position = adjustSourceNodePosition(sourceNode, targetNode, parentNode);
    }

    targetNode.data.leftHandleConnected = true;
    sourceNode.data.rightHandleConnected = true;

    const nodesToChange = Array.from(new Set([sourceNode, targetNode, parentNode, ...siblingNodes])).filter(Boolean);
    const unchangedNodes = nds.filter((n) => !nodesToChange.includes(n));

    const changedNodes = groupNodes(ungroupNodes(nodesToChange));

    return [...unchangedNodes, ...changedNodes];
  });
};

const stopDragNodeWithParent = (
  node: Node,
  storeNodes: Node[],
  setEdges: (payload: Edge[] | ((edges: Edge[]) => Edge[])) => void,
  setNodes: (payload: Node[] | ((nodes: Node[]) => Node[])) => void,
  dragStartNode: React.MutableRefObject<Node | null>,
  dragStartConnectedEdges: React.MutableRefObject<Edge[] | null>,
): void => {
  const parentNode = storeNodes.find((n) => n.id === node.parentId);

  if (!isNodeOutsideParent(node, parentNode)) {
    setNodes((nds) => nds.map((n) => (n.id === node.id ? dragStartNode.current : n)));
    setEdges((eds) => deactivateConnectedEdgesAnimation(eds, node.id));
    return;
  }

  setEdges((edges) => {
    const removedEdges = dragStartConnectedEdges.current;
    const nextEdges = edges.filter((e) => !removedEdges.includes(e));

    setNodes((nds) => {
      for (const edge of removedEdges) {
        const sourceNode = nds.find((n) => n.id === edge.source);
        const targetNode = nds.find((n) => n.id === edge.target);

        if (sourceNode) {
          sourceNode.data.rightHandleConnected = false;
        }
        if (targetNode) {
          targetNode.data.leftHandleConnected = false;
        }
      }

      const nodesToChange = nds.filter((n) => n.id === parentNode.id || n.parentId === parentNode.id);
      const unchangedNodes = nds.filter((n) => !nodesToChange.includes(n));

      const ungroupedNodes = ungroupNodes(nodesToChange);
      const groupedNodes = divideNodesByEdges(ungroupedNodes, nextEdges).flatMap((group) => groupNodes(group));

      return [...unchangedNodes, ...groupedNodes];
    });

    return nextEdges;
  });
};
