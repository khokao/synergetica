import { BaseEdge, EdgeLabelRenderer, getBezierPath, useReactFlow } from "@xyflow/react";
import type { EdgeProps } from "@xyflow/react";
import { CircleX } from "lucide-react";

export const ConnectionEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) => {
  const reactflow = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleDeleteEdge = () => {
    const { getEdges, deleteElements } = reactflow;

    const allEdges = getEdges();
    const edgeToDelete = allEdges.find((e) => e.id === id);

    if (edgeToDelete) {
      deleteElements({ edges: [edgeToDelete] });
    }
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          className="absolute z-50 -translate-x-1/2 -translate-y-1/2 pointer-events-none will-change-[opacity]"
          style={{ left: labelX, top: labelY }}
        >
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white shadow-md opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
            <button type="button" className="text-red-500" onClick={handleDeleteEdge} data-testid="delete-edge-button">
              <CircleX />
            </button>
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
