import React from "react";
import { Handle, Position } from "reactflow";

export const CustomNode = ({ data }) => {
  return (
    <div className="custom-node">
      <img src={data.iconUrl} alt={data.nodeType} className="w-12 h-12" />
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
};
