import React from "react";
import { Handle, Position } from "reactflow";

export const CustomChildNode = ({ data }) => {
  return (
    <div className="relative">
      <img src={data.iconUrl} alt={data.nodeType} className="" />
      <Handle type="target" position={Position.Left} id="left" style={data.leftHandleStyle} />
      <Handle type="source" position={Position.Right} id="right" style={data.rightHandleStyle} />
    </div>
  );
};

export const CustomParentNode = ({ data }) => {
  return <div className="border-2 border-gray-500 rounded-xl" style={{ width: data.width, height: data.height }} />;
};
