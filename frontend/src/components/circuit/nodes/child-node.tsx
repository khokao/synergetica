import { NODE_HEIGHT, NODE_WIDTH } from "@/components/circuit/constants";
import { ChildFooter } from "@/components/circuit/nodes/child-footer";
import { ChildHeader } from "@/components/circuit/nodes/child-header";
import { ChildSelectModal } from "@/components/circuit/nodes/child-select-modal";
import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import React from "react";

export const CustomChildNode = ({ id, selected, data }: NodeProps) => {
  return (
    <div
      className="relative rounded-xl"
      style={{
        borderWidth: data.simulationTargetHighlight ? '4px' : '2px',
        borderColor: (data.simulationTargetHighlight || (selected ? '#DB2777' : '#6B7280')) as string,
        borderStyle: 'solid',
        height: NODE_HEIGHT,
        width: NODE_WIDTH,
      }}
    >
      <ChildHeader data={data} />
      <ChildSelectModal id={id} data={data} />
      <ChildFooter id={id} />
      <Handle
        type="target"
        position={Position.Left}
        className={`w-2 h-2 rounded-full border-2 border-gray-400 ${
          data.leftHandleConnected ? `bg-gray-400` : `bg-white`
        }`}
      />
      <Handle
        type="source"
        position={Position.Right}
        className={`w-2 h-2 rounded-full border-2 border-gray-400 ${
          data.rightHandleConnected ? `bg-gray-400` : `bg-white`
        }`}
      />
    </div>
  );
};
