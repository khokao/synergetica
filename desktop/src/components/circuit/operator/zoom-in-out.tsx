import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { useReactFlow, useViewport } from "@xyflow/react";
import { ZoomIn, ZoomOut } from "lucide-react";
import type { FC } from "react";

export const ZoomInOut: FC = () => {
  const { zoomIn, zoomOut } = useReactFlow();
  const { zoom } = useViewport();

  return (
    <TooltipProvider>
      <div
        className="flex bg-gray-100 rounded-lg shadow-lg border border-gray-300 p-0.5 space-x-0.5"
        data-testid="zoom-in-out"
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="p-0 w-7 h-7 hover:bg-black/5"
              onClick={(e) => {
                e.stopPropagation();
                zoomOut();
              }}
              aria-label="zoom out"
            >
              <ZoomOut className="w-5 h-5 text-gray-500" />
            </Button>
          </TooltipTrigger>
          {/* Using RadixTooltip.Portal to avoid layout issues caused by parent styles */}
          <RadixTooltip.Portal>
            <TooltipContent>
              <p>Zoom out</p>
            </TooltipContent>
          </RadixTooltip.Portal>
        </Tooltip>

        <div className="flex items-center justify-center text-gray-500 w-10 cursor-default">
          {Math.round(zoom * 100)}%
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="p-0 w-7 h-7 hover:bg-black/5"
              onClick={(e) => {
                e.stopPropagation();
                zoomIn();
              }}
              aria-label="zoom in"
            >
              <ZoomIn className="w-5 h-5 text-gray-500" />
            </Button>
          </TooltipTrigger>
          {/* Using RadixTooltip.Portal to avoid layout issues caused by parent styles */}
          <RadixTooltip.Portal>
            <TooltipContent>
              <p>Zoom in</p>
            </TooltipContent>
          </RadixTooltip.Portal>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
