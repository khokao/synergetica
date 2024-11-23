import { ANNOTATION_HANDLE_OFFSET, ActivationColor, NODE_HEIGHT } from "@/components/circuit/constants";
import { Position, getSmoothStepPath, useInternalNode } from "@xyflow/react";
import type { EdgeProps } from "@xyflow/react";

export const AnnotationEdge = ({ id, source, target, style = {}, markerEnd }: EdgeProps) => {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const [sx, sy, sourcePos] = getParams(sourceNode, targetNode);
  const [tx, ty, targetPos] = getParams(targetNode, sourceNode);

  const edgeCenterOffset = style.stroke === ActivationColor ? Math.abs(sy - ty) / 10 : -Math.abs(sy - ty) / 10;

  const [edgePath] = getSmoothStepPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
    centerY: (sy + ty) / 2 + edgeCenterOffset,
  });

  return (
    <path id={id} className="react-flow__edge-path" d={edgePath} strokeWidth={5} markerEnd={markerEnd} style={style} />
  );
};

const getParams = (nodeA, nodeB) => {
  const centerA = nodeA.internals.positionAbsolute.y + NODE_HEIGHT / 2;
  const centerB = nodeB.internals.positionAbsolute.y + NODE_HEIGHT / 2;

  const position = centerA > centerB ? Position.Top : Position.Bottom;

  const handle = nodeA.internals.handleBounds.source.find((h) => h.position === position);

  let offsetY = handle.height / 2;

  switch (position) {
    case Position.Top:
      offsetY = -ANNOTATION_HANDLE_OFFSET;
      break;
    case Position.Bottom:
      offsetY = handle.height + ANNOTATION_HANDLE_OFFSET;
      break;
  }

  const x = nodeA.internals.positionAbsolute.x + handle.x;
  const y = nodeA.internals.positionAbsolute.y + handle.y + offsetY;

  return [x, y, position];
};
