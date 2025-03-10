import { NODE_HEIGHT, NODE_WIDTH } from "@/components/circuit/constants";
import { ChildFooter } from "@/components/circuit/nodes/child-footer";
import { ChildHeader } from "@/components/circuit/nodes/child-header";
import { ChildSelectModal } from "@/components/circuit/nodes/child-select-modal";
import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";

export const CustomChildNode = ({ id, selected, data }: NodeProps) => {
  const outlineWidth = data.simulationTargetHighlight ? "4px" : "2px";
  const highlightColor = data.simulationTargetHighlight || (selected ? "#DB2777" : "#6B7280");

  return (
    <div
      className="relative rounded-xl"
      style={{
        outline: `solid ${outlineWidth} ${highlightColor}`,
        height: NODE_HEIGHT,
        width: NODE_WIDTH,
      }}
      data-testid="custom-node"
    >
      <ChildHeader data={data} />
      <ChildSelectModal id={id} data={data} />
      <ChildFooter id={id} />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        className={`w-2 h-2 rounded-full border-2 border-gray-400 ${
          data.leftHandleConnected ? "bg-gray-400" : "bg-white"
        }`}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className={`w-2 h-2 rounded-full border-2 border-gray-400 ${
          data.rightHandleConnected ? "bg-gray-400" : "bg-white"
        }`}
      />
      <Handle type="source" position={Position.Top} id="top" className="opacity-0" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="opacity-0" />
    </div>
  );
};
