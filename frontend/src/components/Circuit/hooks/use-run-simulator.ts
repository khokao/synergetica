import { useReactFlow } from "@xyflow/react";
import { produce } from 'immer';
import { callCircuitConverterAPI } from '@/components/simulation/hooks/use-simulator-api';
import { useConverter } from "@/components/simulation/contexts/converter-context";
import { usePanelContext } from "@/components/circuit/resizable-panel/resizable-panel-context";

export const useSimulate = () => {
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

      const { getNodes, setNodes } = reactflow;
      const nodes = getNodes();

      const newNodes = produce(nodes, (draft) => {
        draft.forEach((node) => {
          node.data.simulationTargetHighlight = undefined;
        });

        Object.keys(responseData.protein_id2name).map((id, index) => {
          const node = draft.find((node) => node.id === id);
          if (node) {
            node.data.simulationTargetHighlight = `hsl(var(--chart-${(index % 5) + 1}))`
          }
        });
      });

      setNodes(newNodes);
    } catch (error) {
      console.error("Simulation failed:", error);
    }
  };

  return { handleSimulate };
};
