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
  nodeType: string,
  iconUrl: string,
  leftHandleStyle: React.CSSProperties,
  rightHandleStyle: React.CSSProperties,
  position: XYPosition,
): Node => ({
  id: nanoid(),
  type: "child",
  position,
  data: {
    nodeType,
    iconUrl,
    leftHandleStyle,
    rightHandleStyle,
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
      setEdges((edges) => {
        return [
          ...edges.filter((e) => e.source !== node.id && e.target !== node.id),
          ...activateConnectedEdgesAnimation(dragStartConnectedEdges.current, node.id),
        ];
      });
      return;
    }
    setEdges((edges) => edges.filter((e) => e.source !== node.id && e.target !== node.id));
    return;
  }

  setEdges((edges) => {
    return activateConnectedEdgesAnimation(
      addNearestEdge(
        node,
        storeNodes,
        edges.filter((e) => !e.animated),
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

  setEdges((edges) => deactivateConnectedEdgesAnimation(edges, node.id));

  setNodes((nodes) => {
    const draggedNodeIsTarget = nearestEdge.data.draggedNodeIsTarget;

    const sourceNode = nodes.find((n) => n.id === nearestEdge.source);
    const targetNode = nodes.find((n) => n.id === nearestEdge.target);
    const parentNode = draggedNodeIsTarget
      ? nodes.find((n) => n.id === sourceNode.parentId)
      : nodes.find((n) => n.id === targetNode.parentId);
    const siblingNodes = parentNode ? nodes.filter((n) => n.parentId === parentNode.id) : [];

    if (draggedNodeIsTarget) {
      targetNode.position = adjustTargetNodePosition(sourceNode, targetNode, parentNode);
    } else {
      sourceNode.position = adjustSourceNodePosition(sourceNode, targetNode, parentNode);
    }

    targetNode.data.leftHandleConnected = true;
    sourceNode.data.rightHandleConnected = true;

    const nodesToChange = Array.from(new Set([sourceNode, targetNode, parentNode, ...siblingNodes])).filter(Boolean);
    const unchangedNodes = nodes.filter((n) => !nodesToChange.includes(n));

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
    setNodes((nodes) => nodes.map((n) => (n.id === node.id ? dragStartNode.current : n)));
    setEdges((edges) => deactivateConnectedEdgesAnimation(edges, node.id));
    return;
  }

  setEdges((edges) => {
    const removedEdges = dragStartConnectedEdges.current;
    const nextEdges = edges.filter((e) => !removedEdges.includes(e));

    setNodes((nodes) => {
      for (const edge of removedEdges) {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        const targetNode = nodes.find((n) => n.id === edge.target);

        if (sourceNode) {
          sourceNode.data.rightHandleConnected = false;
        }
        if (targetNode) {
          targetNode.data.leftHandleConnected = false;
        }
      }

      const nodesToChange = nodes.filter((n) => n.id === parentNode.id || n.parentId === parentNode.id);
      const unchangedNodes = nodes.filter((n) => !nodesToChange.includes(n));

      const ungroupedNodes = ungroupNodes(nodesToChange);
      const groupedNodes = divideNodesByEdges(ungroupedNodes, nextEdges).flatMap((group) => groupNodes(group));

      return [...unchangedNodes, ...groupedNodes];
    });

    return nextEdges;
  });
};
