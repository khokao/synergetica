import { usePanelContext } from "@/components/circuit/resizable-panel/resizable-panel-context";
import { useEditorContext } from "@/components/editor/editor-context";
import { useApiStatus } from "@/components/simulation/api-status-context";
import { useSimulator } from "@/components/simulation/simulator-context";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { ChartSpline, RotateCw, Zap, ZapOff } from "lucide-react";

export const SimulatorButtons = () => {
  const { openPanel } = usePanelContext();
  const { validationError } = useEditorContext();
  const { isHealthcheckOk } = useApiStatus();
  const { solutions, formulate, reset } = useSimulator();

  const handleRunSimulate = async () => {
    openPanel("right");
    formulate();
  };

  const handleResetSimulate = () => {
    reset();
  };

  const isReadyToSimulate = validationError !== null && validationError.length === 0;
  const hasSimulationResults = solutions.length > 0;

  const buttons = [
    {
      onClick: handleRunSimulate,
      disabled: !isReadyToSimulate,
      icon: <ChartSpline className="w-5 h-5" />,
      label: "Start",
      testId: "simulation-run-button",
    },
    {
      onClick: handleResetSimulate,
      disabled: !hasSimulationResults,
      icon: <RotateCw className="w-5 h-5" />,
      label: "Reset",
      testId: "simulation-reset-button",
    },
  ];

  return (
    <div className="absolute right-2 bottom-4 flex flex-col items-center rounded-lg shadow-lg bg-gray-100 px-2.5 py-2 border border-gray-300 text-gray-800 space-y-1">
      <div className="w-full flex justify-center items-center space-x-2 pb-0.5">
        <h2 className="text-base font-medium tracking-wide">Simulation</h2>
        <TooltipProvider>
          {isHealthcheckOk ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Zap className="w-4 h-4 text-green-600" data-testid="zap-icon" />
              </TooltipTrigger>
              <RadixTooltip.Portal>
                <TooltipContent>
                  <p>API connected</p>
                </TooltipContent>
              </RadixTooltip.Portal>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <ZapOff className="w-4 h-4 text-red-600" data-testid="zapoff-icon" />
              </TooltipTrigger>
              <RadixTooltip.Portal>
                <TooltipContent>
                  <p>API not connected</p>
                </TooltipContent>
              </RadixTooltip.Portal>
            </Tooltip>
          )}
        </TooltipProvider>
      </div>

      <div className="flex flex-row items-center space-x-2">
        {buttons.map(({ onClick, disabled, icon, label, testId }) => (
          <Button key={testId} variant="default" disabled={disabled} onClick={onClick} data-testid={testId}>
            {icon} {label}
          </Button>
        ))}
      </div>
    </div>
  );
};
