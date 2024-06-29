import { CustomChildNode, CustomParentNode } from "@/components/GUI/CustomNode";
import { adjustSourceNodePosition, adjustTargetNodePosition } from "@/components/GUI/utils/adjustNodePosition";
import { animateConnectedEdges } from "@/components/GUI/utils/animateConnectedEdges";
import { addNearestEdge, createNearestEdge } from "@/components/GUI/utils/createNearestEdge";
import { divideNodesByEdges } from "@/components/GUI/utils/divideNodesByEdges";
import { groupNodes, ungroupNodes } from "@/components/GUI/utils/groupNodes";
import { isNodeOutsideParent } from "@/components/GUI/utils/isNodeOutsideParent";
import { nanoid } from "nanoid";
import type React from "react";
import { useCallback, useRef } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Background,
  BackgroundVariant,
  Panel,
  useStoreApi,
} from "reactflow";

const nodeTypes = { child: CustomChildNode, parent: CustomParentNode };

export const Flow: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const store = useStoreApi();
  const { screenToFlowPosition } = useReactFlow();
  const reactFlowWrapper = useRef(null);
  const dragStartNode = useRef(null);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData("application/reactflow-node-type");
      const iconUrl = event.dataTransfer.getData("application/reactflow-icon-url");
      const leftHandleStyle = JSON.parse(event.dataTransfer.getData("application/reactflow-left-handle-style"));
      const rightHandleStyle = JSON.parse(event.dataTransfer.getData("application/reactflow-right-handle-style"));

      if (typeof nodeType === "undefined" || !nodeType) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: nanoid(),
        type: "child",
        position,
        data: {
          nodeType: nodeType,
          iconUrl: iconUrl,
          leftHandleStyle: leftHandleStyle,
          rightHandleStyle: rightHandleStyle,
          leftHandleConnected: false,
          rightHandleConnected: false,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes],
  );

  const onNodeDrag = useCallback(
    (_, node) => {
      if (node.type === "child" && node.parentId) {
        setEdges((eds) => {
          return animateConnectedEdges(eds, node.id);
        });
      } else if (node.type === "child" && !node.parentId) {
        const { nodeInternals } = store.getState();
        const storeNodes = Array.from(nodeInternals.values());
        setEdges((eds) => {
          return animateConnectedEdges(
            addNearestEdge(
              node,
              storeNodes,
              eds.filter((e) => !e.animated),
            ),
            node.id,
          );
        });
      }
      return;
    },
    [setEdges, store],
  );

  const onNodeDragStart = useCallback((_, node) => {
    dragStartNode.current = node;
  }, []);

  const onNodeDragStop = useCallback(
    (_, node) => {
      const { nodeInternals } = store.getState();
      const storeNodes = Array.from(nodeInternals.values());

      if (node.type === "child" && !node.parentId) {
        setEdges((eds) => {
          const nextEdges = eds.filter((e) => !e.animated);
          const nearestEdge = createNearestEdge(node, storeNodes);

          if (!nearestEdge) {
            return nextEdges;
          }

          nextEdges.push(nearestEdge);
          const draggedNodeIsTarget = nearestEdge.data.draggedNodeIsTarget;

          setNodes((nds) => {
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

            const nodesToChange = Array.from(new Set([sourceNode, targetNode, parentNode, ...siblingNodes])).filter(
              Boolean,
            );
            const unchangedNodes = nds.filter((n) => !nodesToChange.includes(n));

            const changedNodes = groupNodes(ungroupNodes(nodesToChange));

            return [...unchangedNodes, ...changedNodes];
          });

          return nextEdges;
        });
      } else if (node.type === "child" && node.parentId) {
        const parentNode = storeNodes.find((n) => n.id === node.parentId);

        if (!isNodeOutsideParent(node, parentNode)) {
          setNodes((nds) => {
            return nds.map((n) => (n.id === node.id ? dragStartNode.current : n));
          });
          return;
        }

        setEdges((eds) => {
          const nextEdges = eds.filter((e) => e.source !== node.id && e.target !== node.id);
          const removedEdges = eds.filter((e) => e.source === node.id || e.target === node.id);

          setNodes((nds) => {
            for (const e of removedEdges) {
              const sourceNode = nds.find((n) => n.id === e.source);
              const targetNode = nds.find((n) => n.id === e.target);

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
      }
      return;
    },
    [setEdges, setNodes, store],
  );

  return (
    <div className="flex-grow h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDrag={onNodeDrag}
        onNodeDragStart={onNodeDragStart}
        onNodeDragStop={onNodeDragStop}
        onDrop={onDrop}
        onDragOver={onDragOver}
        proOptions={{ hideAttribution: true }} // discussion: https://github.com/xyflow/xyflow/discussions/2961
        nodeTypes={nodeTypes}
      >
        <Controls position={"top-right"} />
        <Background variant={BackgroundVariant.Dots} />
        <Panel
          position="bottom-right"
          className="px-2 py-1 text-center border-2 border-black rounded bg-white cursor-pointer"
        >
          Simulate
        </Panel>
      </ReactFlow>
    </div>
  );
};
