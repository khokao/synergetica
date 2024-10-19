import { NODE_HEIGHT, NODE_WIDTH, TEMP_EDGE_ID, TEMP_NODE_ID } from "@/components/circuit/constants";
import { useDnD } from "@/components/circuit/dnd/dnd-context";
import { adjustNodePositionsAndConnectHandles } from "@/components/circuit/hooks/utils/adjust-position";
import { getConnectedComponents } from "@/components/circuit/hooks/utils/connected-components";
import { createChildNode, createTempNode } from "@/components/circuit/hooks/utils/create-node";
import { createNearestEdge } from "@/components/circuit/hooks/utils/nearest-edge";
import { groupNodes, ungroupNodes } from "@/components/circuit/hooks/utils/ungroup-group";
import { findRelatedNodes, isNodeOutsideParent } from "@/components/circuit/hooks/utils/utils";
import { useReactFlow } from "@xyflow/react";
import type { Edge, Node } from "@xyflow/react";
import { produce } from "immer";
import { useCallback, useRef } from "react";

export const useDragNodes = () => {
  const reactflow = useReactFlow();
  const [dndCategory] = useDnD();
  const dragStartNode = useRef<Node | null>(null);
  const dragStartConnectedEdges = useRef<Edge[] | null>(null);

  const getDnDNodePosition = (e, screenToFlowPosition) => {
    const mousePosition = screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    });
    const nodePosition = {
      x: mousePosition.x - NODE_WIDTH / 2,
      y: mousePosition.y - NODE_HEIGHT / 2,
    };

    return nodePosition;
  };

  const removeTempNode = (draftNodes: Node[]) => {
    const tempNodeIndex = draftNodes.findIndex((n) => n.id === TEMP_NODE_ID);
    if (tempNodeIndex !== -1) draftNodes.splice(tempNodeIndex, 1);
  };

  const removeTempEdge = (draftEdges: Edge[]) => {
    const tempEdgeIndex = draftEdges.findIndex((e) => e.id === TEMP_EDGE_ID);
    if (tempEdgeIndex !== -1) draftEdges.splice(tempEdgeIndex, 1);
  };

  const updateOrAddTempNode = (draftNodes: Node[], nodePosition: { x: number; y: number }, category) => {
    const tempNode = draftNodes.find((n) => n.id === TEMP_NODE_ID);
    if (tempNode) {
      tempNode.position = nodePosition;
    } else {
      draftNodes.push(createTempNode(nodePosition, category));
    }
  };

  const addTempEdge = (draftEdges: Edge[], tempNode: Node, nodes: Node[]) => {
    const nearestEdge = createNearestEdge(tempNode, tempNode, nodes);
    if (nearestEdge) {
      nearestEdge.id = TEMP_EDGE_ID;
      nearestEdge.animated = true;
      draftEdges.push(nearestEdge);
    }
  };

  const handleDragOver = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      const { screenToFlowPosition, getNodes, getEdges, setNodes, setEdges } = reactflow;

      const nodePosition = getDnDNodePosition(e, screenToFlowPosition);

      const nodes = getNodes();
      const edges = getEdges();

      // If tempNode exists, update its position. Otherwise, create a new tempNode.
      const newNodes = produce(nodes, (draft) => {
        draft.forEach((node) => node.id !== TEMP_NODE_ID && (node.selected = false));
        updateOrAddTempNode(draft, nodePosition, dndCategory);
      });

      // Delete tempEdge if it exists, and create a new tempEdge if a nearest edge exists.
      const newEdges = produce(edges, (draft) => {
        removeTempEdge(draft);

        const tempNode = newNodes.find((n) => n.id === TEMP_NODE_ID);
        if (tempNode) {
          addTempEdge(draft, tempNode, newNodes);
        }
      });

      setNodes(newNodes);
      setEdges(newEdges);
    },
    [dndCategory, reactflow],
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      const { screenToFlowPosition, getNodes, getEdges, setNodes, setEdges } = reactflow;

      const nodePosition = getDnDNodePosition(e, screenToFlowPosition);

      const nodes = getNodes();
      const edges = getEdges();

      const newNode = createChildNode(nodePosition, dndCategory);
      const nearestEdge = createNearestEdge(newNode, newNode, nodes);

      const newNodes = produce(nodes, (draft) => {
        removeTempNode(draft);
        draft.push(newNode);

        if (nearestEdge) {
          const { sourceNode, targetNode, parentNode, siblingNodes } = findRelatedNodes(draft, nearestEdge);

          adjustNodePositionsAndConnectHandles(newNode, sourceNode, targetNode, parentNode);

          ungroupNodes(draft, parentNode);

          groupNodes(draft, [sourceNode, targetNode, ...siblingNodes]);
        }
      });

      const newEdges = produce(edges, (draft) => {
        removeTempEdge(draft);

        if (nearestEdge) {
          draft.push(nearestEdge);
        }
      });

      setNodes(newNodes);
      setEdges(newEdges);
    },
    [dndCategory, reactflow],
  );

  // Ensure temp node is removed for quick drag-and-drop operations where handleDrop might not fire.
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    const { getNodes, setNodes } = reactflow;
    const nodes = getNodes();

    const newNodes = produce(nodes, (draft) => {
      removeTempNode(draft);
    });

    setNodes(newNodes);
  }, []);

  const handleNodeDragStart = useCallback(
    (e, node: Node) => {
      e.preventDefault();
      e.stopPropagation();

      const { getEdges, setEdges } = reactflow;
      const edges = getEdges();

      const newEdges = produce(edges, (draft) => {
        draft.forEach((e) => {
          if (e.source === node.id || e.target === node.id) {
            e.animated = true;
          }
        });
      });

      dragStartNode.current = node;
      dragStartConnectedEdges.current = newEdges.filter((e) => e.source === node.id || e.target === node.id);

      setEdges(newEdges);
    },
    [reactflow],
  );

  const handleNodeDrag = useCallback(
    (e, node: Node) => {
      e.preventDefault();
      e.stopPropagation();

      const { getNodes, getEdges, setEdges } = reactflow;

      const nodes = getNodes();
      const edges = getEdges();

      if (node.type === "parent") {
        const newEdges = produce(edges, (draft) => {
          removeTempEdge(draft);

          const siblingNodes = nodes.filter((n) => n.parentId === node.id);

          const rightNode = siblingNodes.reduce((acc, curr) => {
            return curr.position.x > acc.position.x ? curr : acc;
          });
          const leftNode = siblingNodes.reduce((acc, curr) => {
            return curr.position.x < acc.position.x ? curr : acc;
          });

          const nearestEdge = createNearestEdge(rightNode, leftNode, nodes);
          if (nearestEdge) {
            nearestEdge.id = TEMP_EDGE_ID;
            nearestEdge.animated = true;
            draft.push(nearestEdge);
          }
        });

        setEdges(newEdges);
        return;
      }

      const parentNode = nodes.find((n) => n.id === node.parentId);

      const newEdges = produce(edges, (draft) => {
        if (parentNode) {
          if (isNodeOutsideParent(node, parentNode)) {
            return draft.filter((e) => e.source !== node.id && e.target !== node.id);
          }
          draft.push(...dragStartConnectedEdges.current);
        } else {
          removeTempEdge(draft);

          addTempEdge(draft, node, nodes);
        }
      });

      setEdges(newEdges);
    },
    [reactflow],
  );

  const handleNodeDragStop = useCallback(
    (e, node: Node) => {
      e.preventDefault();
      e.stopPropagation();

      const { getNodes, getEdges, setNodes, setEdges } = reactflow;

      const nodes = getNodes();
      const edges = getEdges();

      if (node.type === "parent") {
        const rightNode = nodes
          .filter((n) => n.parentId === node.id)
          .reduce((acc, curr) => {
            return curr.position.x > acc.position.x ? curr : acc;
          });
        const leftNode = nodes
          .filter((n) => n.parentId === node.id)
          .reduce((acc, curr) => {
            return curr.position.x < acc.position.x ? curr : acc;
          });

        const nearestEdge = createNearestEdge(rightNode, leftNode, nodes);

        const newNodes = produce(nodes, (draft) => {
          if (!nearestEdge) {
            return;
          }

          const sourceNode = draft.find((n) => n.id === nearestEdge.source);
          const targetNode = draft.find((n) => n.id === nearestEdge.target);
          const sourceParentNode = draft.find((n) => n.id === sourceNode.parentId);
          const targetParentNode = draft.find((n) => n.id === targetNode.parentId);
          const sourceSiblingNodes = draft.filter(
            (n) => (n.type === "child" && n.parentId === sourceNode.parentId) || n.id === sourceNode.id,
          );
          const targetSiblingNodes = draft.filter(
            (n) => (n.type === "child" && n.parentId === targetNode.parentId) || n.id === targetNode.id,
          );

          const adjustSourceSiblingNodes = node.id === sourceNode.parentId;

          ungroupNodes(draft, sourceParentNode);
          ungroupNodes(draft, targetParentNode);

          if (adjustSourceSiblingNodes) {
            const oldPositionX = sourceNode.position.x;
            const oldPositionY = sourceNode.position.y;
            adjustNodePositionsAndConnectHandles(sourceNode, sourceNode, targetNode, undefined);
            const offsetPositionX = sourceNode.position.x - oldPositionX;
            const offsetPositionY = sourceNode.position.y - oldPositionY;

            sourceSiblingNodes.forEach((n) => {
              if (n.id !== sourceNode.id) {
                n.parentId = undefined;
                n.position.x = n.position.x + offsetPositionX;
                n.position.y = n.position.y + offsetPositionY;
              }
            });
          } else {
            const oldPositionX = targetNode.position.x;
            const oldPositionY = targetNode.position.y;
            adjustNodePositionsAndConnectHandles(targetNode, sourceNode, targetNode, undefined);
            const offsetPositionX = targetNode.position.x - oldPositionX;
            const offsetPositionY = targetNode.position.y - oldPositionY;

            targetSiblingNodes.forEach((n) => {
              if (n.id !== targetNode.id) {
                n.parentId = undefined;
                n.position.x = n.position.x + offsetPositionX;
                n.position.y = n.position.y + offsetPositionY;
              }
            });
          }

          groupNodes(draft, [...sourceSiblingNodes, ...targetSiblingNodes]);
        });

        const newEdges = produce(edges, (draft) => {
          removeTempEdge(draft);

          if (nearestEdge) {
            draft.push(nearestEdge);
          }
        });

        setNodes(newNodes);
        setEdges(newEdges);
        return;
      }

      const parentNode = nodes.find((n) => n.id === node.parentId);
      const nearestEdge = createNearestEdge(node, node, nodes);

      const newEdges = produce(edges, (draft) => {
        removeTempEdge(draft);

        if (!parentNode && nearestEdge) {
          draft.push(nearestEdge);
        }

        draft.forEach((e) => {
          e.animated = false;
        });
      });

      const newNodes = produce(nodes, (draft) => {
        if (parentNode) {
          if (isNodeOutsideParent(node, parentNode)) {
            dragStartConnectedEdges.current.forEach((e) => {
              const sourceNode = draft.find((n) => n.id === e.source);
              const targetNode = draft.find((n) => n.id === e.target);

              sourceNode.data.rightHandleConnected = false;
              targetNode.data.leftHandleConnected = false;
            });

            const siblingNodes = draft.filter((n) => n.parentId === parentNode.id);
            siblingNodes.forEach((n) => {
              if (n.parentId === parentNode.id) {
                n.parentId = undefined;
                n.position.x = n.position.x + parentNode.position.x;
                n.position.y = n.position.y + parentNode.position.y;
              }
            });

            const parentIndex = draft.findIndex((n) => n.id === parentNode.id);
            if (parentIndex !== -1) draft.splice(parentIndex, 1);

            const connectedComponents = getConnectedComponents(siblingNodes, newEdges);
            connectedComponents.forEach((cc) => {
              groupNodes(draft, cc);
            });
          } else {
            draft.find((n) => n.id === node.id).position = dragStartNode.current.position;
          }
        } else {
          // drag node has no parent node.
          if (nearestEdge) {
            const { sourceNode, targetNode, parentNode, siblingNodes } = findRelatedNodes(draft, nearestEdge);

            adjustNodePositionsAndConnectHandles(node, sourceNode, targetNode, parentNode);

            ungroupNodes(draft, parentNode);

            groupNodes(draft, [sourceNode, targetNode, ...siblingNodes]);
          }
        }
      });

      setNodes(newNodes);
      setEdges(newEdges);
    },
    [reactflow],
  );

  return {
    handleDragOver,
    handleDrop,
    handleDragLeave,
    handleNodeDragStart,
    handleNodeDrag,
    handleNodeDragStop,
  };
};
