import { CircuitEdgeTypes, CircuitNodeTypes } from "@/components/circuit/constants";
import { Background, BackgroundVariant, ConnectionMode, ReactFlow, ReactFlowProvider } from "@xyflow/react";
import type { Edge, Node } from "@xyflow/react";
import { produce } from "immer";

export const CircuitPreview = ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => {
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
