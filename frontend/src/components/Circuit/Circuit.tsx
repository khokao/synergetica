import { CircuitEdgeTypes, CircuitNodeTypes } from "@/components/circuit/constants";
import { DnDPanel } from "@/components/circuit/dnd/panel";
import { useDeleteNodesEdges } from "@/components/circuit/hooks/use-delete-nodes-edges";
import { useDragNodes } from "@/components/circuit/hooks/use-drag-nodes";
import { Operator } from "@/components/circuit/operator/operator";
import { ExpandCollapseButton } from "@/components/circuit/panel/expand-collapse";
import { Background, BackgroundVariant, Panel, ReactFlow, useEdgesState, useNodesState } from "@xyflow/react";
import type { Edge, Node } from "@xyflow/react";
import type React from "react";

export const Circuit: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const { handleDragOver, handleDrop, handleDragLeave, handleNodeDragStart, handleNodeDrag, handleNodeDragStop } =
    useDragNodes();

  const { handleDelete } = useDeleteNodesEdges();

  return (
    <div
      className="react-flow-wrapper h-full w-full"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <ReactFlow
        id="main-flow"
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
        minZoom={0.5}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} />
        <Panel position="top-center" className="flex items-center justify-center">
          <DnDPanel />
        </Panel>
        <Panel position="top-left">
          <ExpandCollapseButton position="left" />
        </Panel>
        <Panel position="top-right">
          <ExpandCollapseButton position="right" />
        </Panel>
        <Panel position="bottom-left">
          <Operator />
        </Panel>
      </ReactFlow>
    </div>
  );
};
