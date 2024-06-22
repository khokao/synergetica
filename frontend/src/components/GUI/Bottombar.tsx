import { controlNode } from "@/components/GUI/nodes/controlNode";
import { promoterNode } from "@/components/GUI/nodes/promoterNode";
import type React from "react";

export const onDragStart = (event, nodeType, iconUrl) => {
  event.dataTransfer.setData("application/reactflow-node-type", nodeType);
  event.dataTransfer.setData("application/reactflow-icon-url", iconUrl);
  event.dataTransfer.effectAllowed = "move";
};

export const Bottombar: React.FC = () => {
  return (
    <aside className="w-full p-4 bg-gray-100 border-t border-gray-300 flex justify-around">
      {promoterNode}
      {controlNode}
    </aside>
  );
};
