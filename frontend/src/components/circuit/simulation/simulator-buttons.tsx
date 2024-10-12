import React from 'react';
import { Button } from "@/components/ui/button";
import { ChartSpline, RotateCw } from 'lucide-react';
import { useSimulate } from "@/components/circuit/hooks/use-run-simulator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import * as RadixTooltip from '@radix-ui/react-tooltip';

export const SimulatorButtons = () => {
  const { handleSimulate, setConvertResult } = useSimulate();

  return (
    <TooltipProvider>
      <div className="absolute !right-5 !bottom-5 flex space-x-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              size="icon"
              onClick={() => setConvertResult(null)}
              className="w-10 h-10 p-2 shadow-lg"
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
              onClick={handleSimulate}
              className="w-10 h-10 p-2 shadow-lg"
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
