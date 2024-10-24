import { useSimulate } from "@/components/circuit/hooks/use-run-simulator";
import { Button } from "@/components/ui/button";
import { ChartSpline, RotateCw } from "lucide-react";
import React from "react";

export const SimulatorButtons = () => {
  const { handleRunSimulate, handleResetSimulate } = useSimulate();

  const buttons = [
    {
      onClick: handleRunSimulate,
      icon: <ChartSpline className="w-5 h-5" />,
      label: "Simulate",
      testId: "simulation-run-button",
    },
    {
      onClick: handleResetSimulate,
      icon: <RotateCw className="w-5 h-5" />,
      label: "Reset",
      testId: "simulation-reset-button",
    },
  ];

  return (
    <div className="absolute right-5 bottom-5 flex flex-col space-y-2">
      {buttons.map(({ onClick, icon, label, testId }) => (
        <Button
          key={testId}
          variant="default"
          size="icon"
          onClick={onClick}
          className="p-2 w-28 flex items-center"
          data-testid={testId}
        >
          <div className="w-8 flex justify-center">{icon}</div>
          <span className="flex-1 text-center">{label}</span>
        </Button>
      ))}
    </div>
  );
};
