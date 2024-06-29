import { controlNode } from "@/components/GUI/nodes/controlNode";
import { metaNode } from "@/components/GUI/nodes/metaNode";
import { promoterNode } from "@/components/GUI/nodes/promoterNode";
import { recombinaseRecognitionSeqNode } from "@/components/GUI/nodes/recombinaseRecognitionSeqNode";
import { terminatorNode } from "@/components/GUI/nodes/terminatorNode";
import { visibleNode } from "@/components/GUI/nodes/visibleNode";
import { wrapHeadNode } from "@/components/GUI/nodes/wrapHeadNode";
import { wrapTailNode } from "@/components/GUI/nodes/wrapTailNode";
import type React from "react";

export const onDragStart = (event, nodeType, iconUrl, leftHandleStyle, rightHandleStyle) => {
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
      {controlNode}
      {terminatorNode}
      {metaNode}
      {recombinaseRecognitionSeqNode}
      {wrapHeadNode}
      {wrapTailNode}
    </aside>
  );
};
