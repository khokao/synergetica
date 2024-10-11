import React from 'react';
import { useReactFlow } from "@xyflow/react";
import { Button } from "@/components/ui/button"
import { ChartSpline } from 'lucide-react';
import { usePanelContext } from "@/components/circuit/resizable-panel/resizable-panel-context";
import { callCircuitConverterAPI } from '@/components/simulation/hooks/use-simulator-api';
import { useConverter } from "@/components/simulation/contexts/converter-context"

export const RunSimulatorButton = () => {
  const reactflow = useReactFlow();
  const { openPanels, togglePanel } = usePanelContext();
  const { setConvertResult } = useConverter();

  const handleSimulate = async () => {
    const panelPosition = 'right';
    const isOpen = openPanels[panelPosition];

    if (!isOpen) {
      togglePanel(panelPosition);
    }

    try {
      const requestData = {
        flow_json: JSON.stringify(reactflow.toObject()),
      };

      const responseData = await callCircuitConverterAPI(requestData);

      setConvertResult(responseData);
    } catch (error) {
      console.error("Simulation failed:", error);
    }
  };

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
