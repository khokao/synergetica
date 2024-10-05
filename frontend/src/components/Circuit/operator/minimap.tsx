import { MiniMap } from "@xyflow/react";
import type { FC } from "react";

const nodeColor = (node) => {
  switch (node.data.nodeCategory) {
    case "promoter":
      return "#bfdbfe";
    case "protein":
      return "#bbf7d0";
    case "terminator":
      return "#fecaca";
    default:
      return "#e5e7eb";
  }
};

export const ColoredMiniMap: FC = () => {
  return (
    <MiniMap
      nodeColor={nodeColor}
      style={{
        width: 102,
        height: 72,
      }}
      className="!absolute !left-4 !bottom-14 z-[9] !m-0 !w-[102px] !h-[72px] !border-[0.5px] !border-black/8 !rounded-lg !shadow-lg"
    />
  );
};
