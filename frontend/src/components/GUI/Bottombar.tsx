import { promoterNode } from "@/components/GUI/nodes/promoterNode";
import { terminatorNode } from "@/components/GUI/nodes/terminatorNode";
import { visibleNode } from "@/components/GUI/nodes/visibleNode";
import type React from "react";

export const onDragStart = (
  event: React.DragEvent,
  nodeType: string,
  iconUrl: string,
  leftHandleStyle: Record<string, number>,
  rightHandleStyle: Record<string, number>,
): void => {
  event.dataTransfer.setData("application/reactflow-node-type", nodeType);
  event.dataTransfer.setData("application/reactflow-icon-url", iconUrl);
  event.dataTransfer.setData("application/reactflow-left-handle-style", JSON.stringify(leftHandleStyle));
  event.dataTransfer.setData("application/reactflow-right-handle-style", JSON.stringify(rightHandleStyle));
  event.dataTransfer.effectAllowed = "move";
};

export const Bottombar: React.FC = () => {
  return (
    <aside className="w-full p-4 bg-gray-100 border-t border-gray-300 grid grid-cols-4 gap-4">
      {promoterNode}
      {visibleNode}
      {terminatorNode}
    </aside>
  );
};
