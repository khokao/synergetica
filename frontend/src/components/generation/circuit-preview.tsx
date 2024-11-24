import { CircuitEdgeTypes, CircuitNodeTypes } from "@/components/circuit/constants";
import { Background, BackgroundVariant, ConnectionMode, ReactFlow, ReactFlowProvider } from "@xyflow/react";
import type { Edge, Node } from "@xyflow/react";
import { produce } from "immer";
import type React from "react";

interface SnapshotData {
  nodes: Node[];
  edges: Edge[];
  proteinParameter: { [id: string]: number };
}

interface CircuitPreviewProps {
  snapshot: SnapshotData | null;
}

export const CircuitPreview: React.FC<CircuitPreviewProps> = ({ snapshot }) => {
  if (!snapshot) return null;

  const { nodes, edges } = snapshot;

  const newNodes = produce(nodes, (draft) => {
    for (const node of draft) {
      if (node.type === "parent") {
        node.data.showParentId = true;
      }
    }
  });

  return (
    <ReactFlowProvider>
      <ReactFlow
        id="generation-modal-preview-flow"
        nodes={newNodes}
        edges={edges}
        proOptions={{ hideAttribution: true }}
        nodeTypes={CircuitNodeTypes}
        edgeTypes={CircuitEdgeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        nodesFocusable={false}
        edgesFocusable={false}
        elementsSelectable={false}
        className="rounded-lg shadow-md border-2 border-gray-100"
      >
        <Background variant={BackgroundVariant.Dots} />
      </ReactFlow>
    </ReactFlowProvider>
  );
};
