import { NODE_HEIGHT, NODE_WIDTH, TEMP_EDGE_ID, TEMP_NODE_ID } from "@/components/circuit/constants";
import { useDnD } from "@/components/circuit/dnd/dnd-context";
import { adjustNodePositionsAndConnectHandles } from "@/components/circuit/hooks/utils/adjust-position";
import { getConnectedComponents } from "@/components/circuit/hooks/utils/connected-components";
import { createChildNode, createTempNode } from "@/components/circuit/hooks/utils/create-node";
import { createNearestEdge } from "@/components/circuit/hooks/utils/nearest-edge";
import { groupNodes, ungroupNodes } from "@/components/circuit/hooks/utils/ungroup-group";
import { findRelatedNodes, isNodeOutsideParent } from "@/components/circuit/hooks/utils/utils";
import { useChangeSource } from "@/components/editor/editor-context";
import { useReactFlow } from "@xyflow/react";
import type { Edge, Node } from "@xyflow/react";
import { produce } from "immer";
import { useCallback, useRef } from "react";

export const useDragNodes = () => {
  const reactflow = useReactFlow();
  const [dndCategory, _] = useDnD();
  const dragStartNode = useRef<Node | null>(null);
  const dragStartConnectedEdges = useRef<Edge[] | null>(null);
  const { setChangeSource } = useChangeSource();

  const getDnDNodePosition = useCallback(
    (e: React.DragEvent, screenToFlowPosition: (pos: { x: number; y: number }) => { x: number; y: number }) => {
      const mousePosition = screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });
      const nodePosition = {
        x: mousePosition.x - NODE_WIDTH / 2,
        y: mousePosition.y - NODE_HEIGHT / 2,
      };

      return nodePosition;
    },
    [],
  );

  const removeTempNode = useCallback((draftNodes: Node[]) => {
    const tempNodeIndex = draftNodes.findIndex((n) => n.id === TEMP_NODE_ID);
    if (tempNodeIndex !== -1) draftNodes.splice(tempNodeIndex, 1);
  }, []);

  const removeTempEdge = useCallback((draftEdges: Edge[]) => {
    const tempEdgeIndex = draftEdges.findIndex((e) => e.id === TEMP_EDGE_ID);
    if (tempEdgeIndex !== -1) draftEdges.splice(tempEdgeIndex, 1);
  }, []);

  const updateOrAddTempNode = useCallback(
    (draftNodes: Node[], nodePosition: { x: number; y: number }, category: string) => {
      const tempNode = draftNodes.find((n) => n.id === TEMP_NODE_ID);
      if (tempNode) {
        tempNode.position = nodePosition;
      } else {
        draftNodes.push(createTempNode(nodePosition, category));
      }
    },
    [],
  );

  const addTempEdge = useCallback((draftEdges: Edge[], tempNode: Node, nodes: Node[]) => {
    const nearestEdge = createNearestEdge(tempNode, tempNode, nodes);
    if (nearestEdge) {
      nearestEdge.id = TEMP_EDGE_ID;
      nearestEdge.animated = true;
      draftEdges.push(nearestEdge);
    }
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setChangeSource("circuit");

      const { screenToFlowPosition, getNodes, getEdges, setNodes, setEdges } = reactflow;

      const nodePosition = getDnDNodePosition(e, screenToFlowPosition);

      const nodes = getNodes();
      const edges = getEdges();

      const newNodes = produce(nodes, (draft) => {
        for (const node of draft) {
          if (node.id !== TEMP_NODE_ID) {
            node.selected = false;
          }
        }
        if (dndCategory) {
          updateOrAddTempNode(draft, nodePosition, dndCategory);
        }
      });

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
    [dndCategory, reactflow, updateOrAddTempNode, removeTempEdge, addTempEdge, getDnDNodePosition, setChangeSource],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setChangeSource("circuit");

      const { screenToFlowPosition, getNodes, getEdges, setNodes, setEdges } = reactflow;

      const nodePosition = getDnDNodePosition(e, screenToFlowPosition);

      const nodes = getNodes();
      const edges = getEdges();

      if (!dndCategory) return;

      const newNode = createChildNode(nodePosition, dndCategory);
      const nearestEdge = createNearestEdge(newNode, newNode, nodes);

      const newNodes = produce(nodes, (draft) => {
        removeTempNode(draft);
        draft.push(newNode);

        if (nearestEdge) {
          const { sourceNode, targetNode, parentNode, siblingNodes } = findRelatedNodes(draft, nearestEdge);

          if (sourceNode && targetNode) {
            adjustNodePositionsAndConnectHandles(newNode, sourceNode, targetNode, parentNode ?? null);

            ungroupNodes(draft, parentNode);

            groupNodes(draft, [sourceNode, targetNode, ...siblingNodes]);
          }
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
    [dndCategory, reactflow, removeTempNode, getDnDNodePosition, removeTempEdge, setChangeSource],
  );

  // Ensure temp node is removed for quick drag-and-drop operations where handleDrop might not fire.
  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setChangeSource("circuit");

      const { getNodes, setNodes } = reactflow;
      const nodes = getNodes();

      const newNodes = produce(nodes, (draft) => {
        removeTempNode(draft);
      });

      setNodes(newNodes);
    },
    [reactflow, removeTempNode, setChangeSource],
  );

  const handleNodeDragStart = useCallback(
    (e: React.DragEvent, node: Node) => {
      e.preventDefault();
      e.stopPropagation();

      setChangeSource("circuit");

      const { getEdges, setEdges } = reactflow;
      const edges = getEdges();

      const newEdges = produce(edges, (draft) => {
        for (const edge of draft) {
          if (edge.source === node.id || edge.target === node.id) {
            edge.animated = true;
          }
        }
      });

      dragStartNode.current = node;
      dragStartConnectedEdges.current = newEdges.filter((e) => e.source === node.id || e.target === node.id);

      setEdges(newEdges);
    },
    [reactflow, setChangeSource],
  );

  const handleNodeDrag = useCallback(
    (e: React.DragEvent, node: Node) => {
      e.preventDefault();
      e.stopPropagation();

      setChangeSource("circuit");

      const { getNodes, getEdges, setEdges } = reactflow;

      const nodes = getNodes();
      const edges = getEdges();

      if (node.type === "parent") {
        const newEdges = produce(edges, (draft) => {
          removeTempEdge(draft);

          const siblingNodes = nodes.filter((n) => n.parentId === node.id);

          if (siblingNodes.length === 0) return;

          const rightNode = siblingNodes.reduce(
            (acc, curr) => (curr.position.x > acc.position.x ? curr : acc),
            siblingNodes[0],
          );
          const leftNode = siblingNodes.reduce(
            (acc, curr) => (curr.position.x < acc.position.x ? curr : acc),
            siblingNodes[0],
          );

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
            // Remove edges connected to the node
            for (let i = draft.length - 1; i >= 0; i--) {
              const edge = draft[i];
              if (edge.source === node.id || edge.target === node.id) {
                draft.splice(i, 1);
              }
            }
          } else {
            if (dragStartConnectedEdges.current) {
              draft.push(...dragStartConnectedEdges.current);
            }
          }
        } else {
          removeTempEdge(draft);

          addTempEdge(draft, node, nodes);
        }
      });

      setEdges(newEdges);
    },
    [reactflow, removeTempEdge, addTempEdge, setChangeSource],
  );

  const handleNodeDragStop = useCallback(
    (e: React.DragEvent, node: Node) => {
      e.preventDefault();
      e.stopPropagation();

      setChangeSource("circuit");

      const { getNodes, getEdges, setNodes, setEdges } = reactflow;

      const nodes = getNodes();
      const edges = getEdges();

      if (node.type === "parent") {
        const siblingNodes = nodes.filter((n) => n.parentId === node.id);
        if (siblingNodes.length === 0) return;

        const rightNode = siblingNodes.reduce(
          (acc, curr) => (curr.position.x > acc.position.x ? curr : acc),
          siblingNodes[0],
        );
        const leftNode = siblingNodes.reduce(
          (acc, curr) => (curr.position.x < acc.position.x ? curr : acc),
          siblingNodes[0],
        );

        const nearestEdge = createNearestEdge(rightNode, leftNode, nodes);

        const newNodes = produce(nodes, (draft) => {
          if (!nearestEdge) {
            return;
          }

          const sourceNode = draft.find((n) => n.id === nearestEdge.source);
          const targetNode = draft.find((n) => n.id === nearestEdge.target);
          const sourceParentNode = sourceNode ? draft.find((n) => n.id === sourceNode.parentId) : undefined;
          const targetParentNode = targetNode ? draft.find((n) => n.id === targetNode.parentId) : undefined;
          const sourceSiblingNodes = draft.filter(
            (n) => (n.type === "child" && n.parentId === sourceNode?.parentId) || n.id === sourceNode?.id,
          );
          const targetSiblingNodes = draft.filter(
            (n) => (n.type === "child" && n.parentId === targetNode?.parentId) || n.id === targetNode?.id,
          );

          const adjustSourceSiblingNodes = node.id === sourceNode?.parentId;

          if (sourceParentNode) {
            ungroupNodes(draft, sourceParentNode);
          }
          if (targetParentNode) {
            ungroupNodes(draft, targetParentNode);
          }

          if (adjustSourceSiblingNodes && sourceNode && targetNode) {
            const oldPositionX = sourceNode.position.x;
            const oldPositionY = sourceNode.position.y;
            adjustNodePositionsAndConnectHandles(sourceNode, sourceNode, targetNode, null);
            const offsetPositionX = sourceNode.position.x - oldPositionX;
            const offsetPositionY = sourceNode.position.y - oldPositionY;

            for (const n of sourceSiblingNodes) {
              if (n.id !== sourceNode.id) {
                n.parentId = undefined;
                n.position.x += offsetPositionX;
                n.position.y += offsetPositionY;
              }
            }
          } else if (sourceNode && targetNode) {
            const oldPositionX = targetNode.position.x;
            const oldPositionY = targetNode.position.y;
            adjustNodePositionsAndConnectHandles(targetNode, sourceNode, targetNode, null);
            const offsetPositionX = targetNode.position.x - oldPositionX;
            const offsetPositionY = targetNode.position.y - oldPositionY;

            for (const n of targetSiblingNodes) {
              if (n.id !== targetNode.id) {
                n.parentId = undefined;
                n.position.x += offsetPositionX;
                n.position.y += offsetPositionY;
              }
            }
          }

          if (sourceNode && targetNode) {
            groupNodes(draft, [...sourceSiblingNodes, ...targetSiblingNodes]);
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
        return;
      }

      const parentNode = nodes.find((n) => n.id === node.parentId);
      const nearestEdge = createNearestEdge(node, node, nodes);

      const newEdges = produce(edges, (draft) => {
        removeTempEdge(draft);

        if (!parentNode && nearestEdge) {
          draft.push(nearestEdge);
        }

        for (const edge of draft) {
          edge.animated = false;
        }
      });

      const newNodes = produce(nodes, (draft) => {
        if (parentNode) {
          if (isNodeOutsideParent(node, parentNode)) {
            if (dragStartConnectedEdges.current) {
              for (const edge of dragStartConnectedEdges.current) {
                const sourceNode = draft.find((n) => n.id === edge.source);
                const targetNode = draft.find((n) => n.id === edge.target);

                if (sourceNode) {
                  sourceNode.data.rightHandleConnected = false;
                }
                if (targetNode) {
                  targetNode.data.leftHandleConnected = false;
                }
              }
            }

            const siblingNodes = draft.filter((n) => n.parentId === parentNode.id);
            for (const n of siblingNodes) {
              if (n.parentId === parentNode.id) {
                n.parentId = undefined;
                n.position.x += parentNode.position.x;
                n.position.y += parentNode.position.y;
              }
            }

            const parentIndex = draft.findIndex((n) => n.id === parentNode.id);
            if (parentIndex !== -1) draft.splice(parentIndex, 1);

            const connectedComponents = getConnectedComponents(siblingNodes, newEdges);
            for (const cc of connectedComponents) {
              groupNodes(draft, cc);
            }
          } else {
            if (dragStartNode.current) {
              const targetNode = draft.find((n) => n.id === node.id);
              if (targetNode) {
                targetNode.position = { ...dragStartNode.current.position };
              }
            }
          }
        } else {
          if (nearestEdge) {
            const { sourceNode, targetNode, parentNode, siblingNodes } = findRelatedNodes(draft, nearestEdge);

            if (sourceNode && targetNode) {
              adjustNodePositionsAndConnectHandles(node, sourceNode, targetNode, parentNode ?? null);

              ungroupNodes(draft, parentNode);

              groupNodes(draft, [sourceNode, targetNode, ...siblingNodes]);
            }
          }
        }
      });

      setNodes(newNodes);
      setEdges(newEdges);
    },
    [reactflow, removeTempEdge, setChangeSource],
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
