import type { NodeProps } from "@xyflow/react";

export const CustomParentNode = ({ id }: NodeProps) => {
  return (
    <div className="relative size-full !z-0 bg-gray-100 border-dashed border-2 border-gray-500 rounded-md">
      <div className="absolute top-[-40px] left-0 px-3 py-0 text-lg text-gray-800 bg-gray-100 rounded-full">{id}</div>
    </div>
  );
};
