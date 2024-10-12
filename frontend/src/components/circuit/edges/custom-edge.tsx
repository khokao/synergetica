import { BaseEdge, EdgeLabelRenderer, type EdgeProps, getBezierPath, useReactFlow } from "@xyflow/react";
import { CircleX } from "lucide-react";
import React from "react";

export const CustomEdge = ({
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
          className="absolute transform translate-x-[-50%] translate-y-[-50%] p-1 w-8 h-8 bg-white shadow-md rounded-full hover:opacity-100 opacity-0 transition-opacity duration-300 z-50"
          style={{ left: labelX, top: labelY, pointerEvents: "all" }}
        >
          <button className="text-red-500 hover:text-red-700 focus:outline-none" onClick={handleDeleteEdge}>
            <CircleX />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
