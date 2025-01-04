import { usePanelContext } from "@/components/circuit/resizable-panel/resizable-panel-context";
import { useEditorContext } from "@/components/editor/editor-context";
import { useSimulator } from "@/components/simulation/simulator-context";
import { Button } from "@/components/ui/button";
import { ChartSpline, RotateCw } from "lucide-react";

export const SimulatorButtons = () => {
  const { validationError } = useEditorContext();
  const { openPanels, togglePanel } = usePanelContext();
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
      icon: <ChartSpline className="w-5 h-5" />,
      label: "Simulate",
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
    <div className="absolute right-5 bottom-5 flex flex-col space-y-2">
      {buttons.map(({ onClick, disabled, icon, label, testId }) => (
        <Button
          key={testId}
          variant="default"
          disabled={disabled}
          onClick={onClick}
          className="relative w-28 flex items-center"
          data-testid={testId}
        >
          <div className="absolute left-2 w-7 flex justify-center">{icon}</div>
          <span className="absolute left-10 flex-1 text-center">{label}</span>
        </Button>
      ))}
    </div>
  );
};
