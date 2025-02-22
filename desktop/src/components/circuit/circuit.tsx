import { CircuitEdgeTypes, CircuitNodeTypes } from "@/components/circuit/constants";
import { DnDPanel } from "@/components/circuit/dnd/dnd-panel";
import { CustomMarkers } from "@/components/circuit/edges/custom-markers";
import { useDeleteNodesEdges } from "@/components/circuit/hooks/use-delete-nodes-edges";
import { useDragNodes } from "@/components/circuit/hooks/use-drag-nodes";
import { useUpdateAnnotationEdges } from "@/components/circuit/hooks/use-update-annotation-edges";
import { Operator } from "@/components/circuit/operator/operator";
import { ExpandCollapseButton } from "@/components/circuit/resizable-panel/expand-collapse";
import { SimulatorButtons } from "@/components/simulation/simulator-buttons";
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import type { Edge, Node } from "@xyflow/react";

export const Circuit = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const { handleDragOver, handleDrop, handleDragLeave, handleNodeDragStart, handleNodeDrag, handleNodeDragStop } =
    useDragNodes();

  const { handleDelete } = useDeleteNodesEdges();

  useUpdateAnnotationEdges();

  return (
    <div
      className="react-flow-wrapper h-full w-full"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <CustomMarkers />
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
        connectionMode={ConnectionMode.Loose}
        defaultViewport={{ x: 100, y: 100, zoom: 1.0 }}
        minZoom={0.25}
        maxZoom={2.0}
        proOptions={{ hideAttribution: true }}
        colorMode="light"
      >
        <Background variant={BackgroundVariant.Dots} />
        <Panel position="top-center">
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
        <Panel position="bottom-right">
          <SimulatorButtons />
        </Panel>
      </ReactFlow>
    </div>
  );
};
