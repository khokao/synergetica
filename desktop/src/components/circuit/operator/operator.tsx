import { ColoredMiniMap } from "@/components/circuit/operator/minimap";
import { PartsManager } from "@/components/circuit/operator/parts-manager/parts-manager";
import { ValidationStatus } from "@/components/circuit/operator/validation-status";
import { ZoomInOut } from "@/components/circuit/operator/zoom-in-out";
import type { FC } from "react";

export const Operator: FC = () => {
  return (
    <>
      <ColoredMiniMap />
      <div className="flex items-center mt-1 gap-2 absolute left-4 bottom-4 z-[9]">
        <ZoomInOut />
      </div>
      <div className="flex items-center mt-1 gap-2 absolute left-32 bottom-4 z-[9]">
        <ValidationStatus />
      </div>
      <div className="flex items-center mt-1 gap-2 absolute left-[168px] bottom-4 z-[9]">
        <PartsManager />
      </div>
    </>
  );
};
