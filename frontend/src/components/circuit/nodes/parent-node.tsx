import { Badge } from "@/components/ui/badge";
import type { NodeProps } from "@xyflow/react";

export const CustomParentNode = ({ id, data }: NodeProps) => {
  const { showParentId } = data;

  return (
    <div className="relative size-full !z-0 bg-parent-100 border-parent-500 border-dashed border-2 rounded-md">
      {typeof showParentId === "boolean" && showParentId && (
        <Badge className="absolute top-[-40px] left-0 px-3 py-0 h-8 text-lg">{id}</Badge>
      )}
    </div>
  );
};
