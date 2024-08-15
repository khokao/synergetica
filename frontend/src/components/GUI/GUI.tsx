import { Bottombar } from "@/components/GUI/Bottombar";
import { Flow } from "@/components/GUI/Flow";
import type React from "react";
import { ReactFlowProvider } from "reactflow";
import { ConverterRequestData } from "@/interfaces/simulatorAPI";
import "reactflow/dist/style.css";

type GUIProps = {
  onClickSimulate: (data: ConverterRequestData) => void;
};

export const GUI: React.FC<GUIProps> = ({ onClickSimulate }) => {
  return (
    <ReactFlowProvider>
      <div className="flex flex-col flex-grow h-full">
        <div className="flex-grow" data-testid="flow-component">
          <Flow onClickSimulate={onClickSimulate} />
        </div>
        <div data-testid="bottombar-component">
          <Bottombar />
        </div>
      </div>
    </ReactFlowProvider>
  );
};
