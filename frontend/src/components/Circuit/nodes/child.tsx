import { NODE_HEIGHT, NODE_WIDTH } from "@/components/circuit/constants";
import { ChildFooter } from "@/components/circuit/nodes/child-footer";
import { ChildHeader } from "@/components/circuit/nodes/child-header";
import { ChildSelectModal } from "@/components/circuit/nodes/child-select-modal";
import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import React from "react";

export const CustomChildNode = ({ id, selected, data }: NodeProps) => {
  const { nodeCategory, nodePartsName } = data;

  return (
    <div
      className={`relative rounded-xl border-2 ${selected ? "border-pink-600" : "border-gray-500"}`}
      style={{ height: NODE_HEIGHT, width: NODE_WIDTH }}
    >
      <ChildHeader nodeCategory={nodeCategory} />
      <ChildSelectModal id={id} nodeCategory={nodeCategory} nodePartsName={nodePartsName} />
      <ChildFooter id={id} />
      <Handle
        type="target"
        position={Position.Left}
        className={`w-3 h-3 rounded-full border-2 border-gray-400 ${
          data.leftHandleConnected ? `bg-gray-400` : `bg-white`
        }`}
      />
      <Handle
        type="source"
        position={Position.Right}
        className={`w-3 h-3 rounded-full border-2 border-gray-400 ${
          data.rightHandleConnected ? `bg-gray-400` : `bg-white`
        }`}
      />
      {id}
    </div>
  );
};
