import { CustomChildNode, CustomParentNode } from "@/components/GUI/CustomNode";
import { createChildNode, dragChildNode, stopDragChildNode } from "@/components/GUI/nodeActions";
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

      if (!nodeType) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = createChildNode(nodeType, iconUrl, leftHandleStyle, rightHandleStyle, position);

      setNodes((nodes) => nodes.concat(newNode));
    },
    [screenToFlowPosition, setNodes],
  );

  const onNodeDrag = useCallback(
    (_, node) => {
      if (node.type === "child") {
        dragChildNode(node, setEdges, store);
      }
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

      if (node.type === "child") {
        stopDragChildNode(node, storeNodes, setEdges, setNodes, dragStartNode);
      }
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
        <Controls position="top-right" />
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
