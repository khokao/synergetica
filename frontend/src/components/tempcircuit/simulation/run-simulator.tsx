import React from 'react';
import { Button } from "@/components/ui/button";
import { ChartSpline } from 'lucide-react';
import { useSimulate } from "@/components/circuit/hooks/use-run-simulator";

export const RunSimulatorButton = () => {
  const { handleSimulate } = useSimulate();

  return (
    <Button
      variant="default"
      size="icon"
      onClick={handleSimulate}
      className="absolute !right-5 !bottom-5 w-12 h-12 p-2 shadow-lg"
    >
      <ChartSpline className="w-12 h-12" />
    </Button>
  );
};
