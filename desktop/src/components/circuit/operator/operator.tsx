import { ColoredMiniMap } from "@/components/circuit/operator/minimap";
import { PartsManager } from "@/components/circuit/operator/parts-manager/parts-manager";
import { ResetCircuit } from "@/components/circuit/operator/reset-circuit";
import { ValidationStatus } from "@/components/circuit/operator/validation-status";
import { ZoomInOut } from "@/components/circuit/operator/zoom-in-out";

export const Operator = () => {
  return (
    <>
      <ColoredMiniMap />
      <div className="flex items-center mt-1 gap-2 absolute left-4 bottom-4 z-[9]">
        <ZoomInOut />
      </div>
      <div className="flex items-center mt-1 gap-2 absolute left-32 bottom-4 z-[9]">
        <PartsManager />
      </div>
      <div className="flex items-center mt-1 gap-2 absolute left-[322px] bottom-4 z-[9]">
        <ValidationStatus />
      </div>
      <div className="flex items-center mt-1 gap-2 absolute left-[362px] bottom-4 z-[9]">
        <ResetCircuit />
      </div>
    </>
  );
};
