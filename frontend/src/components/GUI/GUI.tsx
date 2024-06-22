import { Bottombar } from "@/components/GUI/Bottombar";
import { Flow } from "@/components/GUI/Flow";
import type React from "react";
import { ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";

export const GUI: React.FC = () => {
  return (
    <ReactFlowProvider>
      <div className="flex flex-col flex-grow h-full">
        <Flow />
        <Bottombar />
      </div>
    </ReactFlowProvider>
  );
};
