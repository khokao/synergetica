import type React from "react";
import { Handle, type NodeProps, Position } from "reactflow";

interface CustomChildNodeData {
  iconUrl: string;
  nodeType: string;
  leftHandleStyle: React.CSSProperties;
  rightHandleStyle: React.CSSProperties;
}

interface CustomParentNodeData {
  width: number;
  height: number;
}

export const CustomChildNode = ({ data }: NodeProps<CustomChildNodeData>) => {
  return (
    <div className="relative">
      <img src={data.iconUrl} alt={data.nodeType} className="" />
      <Handle type="target" position={Position.Left} id="left" style={data.leftHandleStyle} />
      <Handle type="source" position={Position.Right} id="right" style={data.rightHandleStyle} />
    </div>
  );
};

export const CustomParentNode = ({ data }: NodeProps<CustomParentNodeData>) => {
  return <div className="border-2 border-gray-500 rounded-xl" style={{ width: data.width, height: data.height }} />;
};
