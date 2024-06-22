import { CustomNode } from "@/components/GUI/CustomNode";
import type React from "react";
import { useCallback, useRef } from "react";
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Background,
  BackgroundVariant,
  Panel,
} from "reactflow";

let id = 0;
const getId = () => `node_${id++}`;

const nodeTypes = { custom: CustomNode };

export const Flow: React.FC = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData("application/reactflow-node-type");
      const iconUrl = event.dataTransfer.getData("application/reactflow-icon-url");

      if (typeof nodeType === "undefined" || !nodeType) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type: "custom",
        position,
        data: { nodeType: nodeType, iconUrl: iconUrl},
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes],
  );

  return (
    <div className="flex-grow h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
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
