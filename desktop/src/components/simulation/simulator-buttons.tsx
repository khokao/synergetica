import { usePanelContext } from "@/components/circuit/resizable-panel/resizable-panel-context";
import { useEditorContext } from "@/components/editor/editor-context";
import { useApiStatus } from "@/components/simulation/api-status-context";
import { useSimulator } from "@/components/simulation/simulator-context";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { ChartSpline, RotateCw, Zap, ZapOff } from "lucide-react";

export const SimulatorButtons = () => {
  const { openPanels, togglePanel } = usePanelContext();
  const { validationError } = useEditorContext();
  const { isHealthcheckOk } = useApiStatus();
  const { solutions, formulate, reset } = useSimulator();

  const handleRunSimulate = async () => {
    const panelPosition = "right";
    const isOpen = openPanels[panelPosition];
    if (!isOpen) {
      togglePanel(panelPosition);
    }
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
      icon: <ChartSpline className="w-6 h-6" />,
      label: "Run",
      testId: "simulation-run-button",
    },
    {
      onClick: handleResetSimulate,
      disabled: !hasSimulationResults,
      icon: <RotateCw className="w-6 h-6" />,
      label: "Reset",
      testId: "simulation-reset-button",
    },
  ];

  return (
    <div className="absolute right-2 bottom-4">
      <div className="relative bg-gray-100 rounded-lg shadow-lg border border-gray-300 p-3">
        <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2">
          <TooltipProvider>
            {isHealthcheckOk ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Zap className="w-6 h-6 text-green-600" data-testid="zap-icon" />
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
                  <ZapOff className="w-6 h-6 text-red-600" data-testid="zapoff-icon" />
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

        <h2 className="text-lg font-semibold text-center">Simulator</h2>

        <div className="mt-2 flex flex-col items-center space-y-2">
          {buttons.map(({ onClick, disabled, icon, label, testId }) => (
            <Button
              key={testId}
              variant="default"
              disabled={disabled}
              onClick={onClick}
              className="relative w-24 flex items-center"
              data-testid={testId}
            >
              <div className="absolute left-2 w-7 flex justify-center">{icon}</div>
              <span className="absolute left-10 flex-1 text-center">{label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
