import { Button } from "@/components/ui/button";
import { useReactFlow, useViewport } from "@xyflow/react";
import { ZoomIn, ZoomOut } from "lucide-react";
import type { FC } from "react";

export const ZoomInOut: FC = () => {
  const { zoomIn, zoomOut } = useReactFlow();
  const { zoom } = useViewport();

  return (
    <div className="flex bg-gray-100 rounded-xl shadow-lg border border-gray-300" data-testid="zoom-in-out">
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 p-0 hover:bg-black/5"
        onClick={(e) => {
          e.stopPropagation();
          zoomOut();
        }}
        aria-label="zoom out"
      >
        <ZoomOut className="w-6 h-6 text-gray-500" />
      </Button>

      <div className="flex items-center justify-center text-gray-500 w-10">{Math.round(zoom * 100)}%</div>

      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 p-0 hover:bg-black/5"
        onClick={(e) => {
          e.stopPropagation();
          zoomIn();
        }}
        aria-label="zoom in"
      >
        <ZoomIn className="w-6 h-6 text-gray-500" />
      </Button>
    </div>
  );
};
