import { adjustSourceNodePosition, adjustTargetNodePosition } from "@/components/GUI/utils/adjustNodePosition";
import { activateConnectedEdgesAnimation, deactivateConnectedEdgesAnimation } from "@/components/GUI/utils/animateConnectedEdges";
import { addNearestEdge, createNearestEdge } from "@/components/GUI/utils/createNearestEdge";
import { divideNodesByEdges } from "@/components/GUI/utils/divideNodesByEdges";
import { groupNodes, ungroupNodes } from "@/components/GUI/utils/groupNodes";
import { isNodeOutsideParent } from "@/components/GUI/utils/isNodeOutsideParent";
import { nanoid } from "nanoid";

export const createChildNode = (nodeType, iconUrl, leftHandleStyle, rightHandleStyle, position) => ({
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

export const dragChildNode = (node, setEdges, store) => {
  const { nodeInternals } = store.getState();
  const storeNodes = Array.from(nodeInternals.values());

  if (node.parentId) {
    setEdges((edges) => activateConnectedEdgesAnimation(edges, node.id));
  } else {
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
  }
};

export const stopDragChildNode = (node, storeNodes, setEdges, setNodes, dragStartNode) => {
  if (!node.parentId) {
    stopDragNodeWithoutParent(node, storeNodes, setEdges, setNodes);
  } else {
    stopDragNodeWithParent(node, storeNodes, setEdges, setNodes, dragStartNode);
  }
};

const stopDragNodeWithoutParent = (node, storeNodes, setEdges, setNodes) => {
  const nearestEdge = createNearestEdge(node, storeNodes);

  if (!nearestEdge) {
    return;
  }

  setEdges((edges) => deactivateConnectedEdgesAnimation(edges, node.id))

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

const stopDragNodeWithParent = (node, storeNodes, setEdges, setNodes, dragStartNode) => {
  const parentNode = storeNodes.find((n) => n.id === node.parentId);

  if (!isNodeOutsideParent(node, parentNode)) {
    setNodes((nodes) => nodes.map((n) => (n.id === node.id ? dragStartNode.current : n)));
    setEdges((edges) => deactivateConnectedEdgesAnimation(edges, node.id));
    return;
  }

  setEdges((edges) => {
    const nextEdges = edges.filter((e) => e.source !== node.id && e.target !== node.id);
    const removedEdges = edges.filter((e) => e.source === node.id || e.target === node.id);

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
