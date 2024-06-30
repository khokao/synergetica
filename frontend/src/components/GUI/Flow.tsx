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
  type ReactFlowState,
  type NodeTypes,
  type Node,
  type Edge,
} from "reactflow";
import type { StoreApi } from "zustand";

const nodeTypes: NodeTypes = { child: CustomChildNode, parent: CustomParentNode };

export const Flow: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const store = useStoreApi();
  const { screenToFlowPosition } = useReactFlow();
  const reactFlowWrapper = useRef(null);
  const dragStartNode = useRef<Node | null>(null);
  const dragStartConnectedEdges = useRef<Edge[] | null>(null);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
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
    (_, node: Node) => {
      if (node.type === "child") {
        dragChildNode(node, setEdges, store as StoreApi<ReactFlowState>, dragStartConnectedEdges);
      }
    },
    [setEdges, store],
  );

  const onNodeDragStart = useCallback(
    (_, node: Node) => {
      dragStartNode.current = node;

      const edges = store.getState().edges;
      dragStartConnectedEdges.current = edges.filter((e) => e.source === node.id || e.target === node.id);
    },
    [store],
  );

  const onNodeDragStop = useCallback(
    (_, node: Node) => {
      const { nodeInternals } = store.getState();
      const storeNodes = Array.from(nodeInternals.values());

      if (node.type === "child") {
        stopDragChildNode(node, storeNodes, setEdges, setNodes, dragStartNode, dragStartConnectedEdges);
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
