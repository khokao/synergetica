import { NodeCommandPalette } from "@/components/GUI/NodeCommandPalette";
import type React from "react";
import { Handle, type NodeProps, Position } from "reactflow";

interface ControlData {
  partsId: string;
  controlType: string;
}

export interface OptionData {
  name: string;
  description: string;
  subcategory: string;
  sequence: string;
  controlBy: ControlData[] | null;
  controlTo: ControlData[] | null;
  meta: Record<string, unknown> | null;
}

interface CustomChildNodeData {
  iconUrl: string;
  nodeCategory: string;
  nodeSubcategory: string | undefined;
  nodePartsName: string | undefined;
  sequence: string | undefined;
  controlBy: ControlData[] | null;
  controlTo: ControlData[] | null;
  meta: Record<string, unknown> | null;
  leftHandleStyle: React.CSSProperties;
  rightHandleStyle: React.CSSProperties;
  commandPaletteButtonStyle: React.CSSProperties;
}

interface CustomParentNodeData {
  width: number;
  height: number;
}

export const CustomChildNode = ({ id, data }: NodeProps<CustomChildNodeData>) => {
  return (
    <div className="relative">
      <img src={data.iconUrl} alt={data.nodeCategory} className="" />
      <Handle type="target" position={Position.Left} id="left" style={data.leftHandleStyle} data-testid="handle-left" />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={data.rightHandleStyle}
        data-testid="handle-right"
      />
      <div className="absolute" style={data.commandPaletteButtonStyle} data-testid="command-palette-button">
        <NodeCommandPalette nodeCategory={data.nodeCategory} nodeId={id} />
      </div>
    </div>
  );
};

export const CustomParentNode = ({ data }: NodeProps<CustomParentNodeData>) => {
  return (
    <div
      className="border-2 border-gray-500 rounded-xl"
      style={{ width: data.width, height: data.height }}
      data-testid="parent-node"
    />
  );
};
