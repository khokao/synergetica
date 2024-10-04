import type React from "react";
import { humanId } from "human-id";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Background,
  BackgroundVariant,
  Panel,
  useStoreApi,
} from "@xyflow/react";
import type { Node, Edge } from "@xyflow/react";
import { CircuitNodeTypes, CircuitEdgeTypes } from "@/components/Circuit/constants";
import { useDragNodes } from "@/components/Circuit/hooks/use-drag-nodes";
import { useDeleteNodesEdges } from "@/components/Circuit/hooks/use-delete-nodes-edges";
import { DnDPanel } from "@/components/Circuit/Panel";
import { Operator } from "@/components/Circuit/operator/index";


export const Circuit: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const {
    handleDragOver,
    handleDrop,
    handleDragLeave,
    handleNodeDragStart,
    handleNodeDrag,
    handleNodeDragStop,
  } = useDragNodes();

  const {
    handleDelete,
  } = useDeleteNodesEdges();

  return (
      <div
        // ref={reactFlowWrapper}
        className="react-flow-wrapper h-full"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeDrag={handleNodeDrag}
          onNodeDragStart={handleNodeDragStart}
          onNodeDragStop={handleNodeDragStop}
          onDelete={handleDelete}
          nodeTypes={CircuitNodeTypes}
          edgeTypes={CircuitEdgeTypes}
          defaultViewport={{ x: 0, y: 0, zoom: 1.0 }}
          minZoom={0.1}
          maxZoom={2.0}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} />
          {/* <Panel position="top-right" onClick={handleClickSimulate}>
            <SimulateButton />
          </Panel> */}
          <Panel position="top-left">
            <DnDPanel />
          </Panel>
          <Panel position="bottom-left">
            <Operator />
          </Panel>
        </ReactFlow>
      </div>
  );
};
