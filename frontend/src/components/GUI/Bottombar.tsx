import { promoterNode } from "@/components/GUI/nodes/promoterNode";
import { proteinNode } from "@/components/GUI/nodes/proteinNode";
import { terminatorNode } from "@/components/GUI/nodes/terminatorNode";
import type React from "react";

export const onDragStart = (
  event: React.DragEvent,
  iconUrl: string,
  nodeCategory: string,
  nodeSubcategory: string,
  leftHandleStyle: Record<string, number>,
  rightHandleStyle: Record<string, number>,
  selectMenuStyle: Record<string, number>,
  selectMenuOptions: Array<Record<string, string>>,
): void => {
  event.dataTransfer.setData("application/reactflow-icon-url", iconUrl);
  event.dataTransfer.setData("application/reactflow-node-category", nodeCategory);
  event.dataTransfer.setData("application/reactflow-node-subcategory", nodeSubcategory);
  event.dataTransfer.setData("application/reactflow-left-handle-style", JSON.stringify(leftHandleStyle));
  event.dataTransfer.setData("application/reactflow-right-handle-style", JSON.stringify(rightHandleStyle));
  event.dataTransfer.setData("application/reactflow-select-menu-style", JSON.stringify(selectMenuStyle));
  event.dataTransfer.setData("application/reactflow-select-menu-options", JSON.stringify(selectMenuOptions));
  event.dataTransfer.effectAllowed = "move";
};

export const Bottombar: React.FC = () => {
  return (
    <aside className="w-full p-4 bg-gray-100 border-t border-gray-300 grid grid-cols-4 gap-4">
      {promoterNode}
      {proteinNode}
      {terminatorNode}
    </aside>
  );
};
