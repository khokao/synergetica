import { useSimulate } from "@/components/circuit/hooks/use-run-simulator";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { ChartSpline, RotateCw } from "lucide-react";
import React from "react";

export const SimulatorButtons = () => {
  const { handleRunSimulate, handleResetSimulate } = useSimulate();

  return (
    <TooltipProvider>
      <div className="absolute !right-5 !bottom-5 flex space-x-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              size="icon"
              onClick={handleResetSimulate}
              className="w-10 h-10 p-2 shadow-lg"
              data-testid="simulation-reset-button"
            >
              <RotateCw className="w-10 h-10" />
            </Button>
          </TooltipTrigger>

          {/* Using RadixTooltip.Portal to avoid layout issues caused by parent styles */}
          <RadixTooltip.Portal>
            <TooltipContent align="center">
              <p>Reset</p>
            </TooltipContent>
          </RadixTooltip.Portal>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              size="icon"
              onClick={handleRunSimulate}
              className="w-10 h-10 p-2 shadow-lg"
              data-testid="simulation-run-button"
            >
              <ChartSpline className="w-10 h-10" />
            </Button>
          </TooltipTrigger>
          <RadixTooltip.Portal>
            <TooltipContent align="center">
              <p>Simulate</p>
            </TooltipContent>
          </RadixTooltip.Portal>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
