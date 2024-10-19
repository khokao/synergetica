import React from 'react';
import { ReactFlow, ReactFlowProvider, Background, BackgroundVariant } from '@xyflow/react';
import { produce } from 'immer';
import { CircuitEdgeTypes, CircuitNodeTypes } from '@/components/circuit/constants';
import { Node, Edge } from '@xyflow/react';

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
    draft.forEach((node) => {
      if (node.type === 'parent') {
        node.data.showParentId = true;
      }
    });
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
