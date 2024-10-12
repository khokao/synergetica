import { ColoredMiniMap } from "@/components/circuit/operator/minimap";
import { ZoomInOut } from "@/components/circuit/operator/zoom-in-out";
import type { FC } from "react";

export const Operator: FC = () => {
  return (
    <>
      <ColoredMiniMap />
      <div className="flex items-center mt-1 gap-2 absolute left-4 bottom-4 z-[9]">
        <ZoomInOut />
      </div>
    </>
  );
};
