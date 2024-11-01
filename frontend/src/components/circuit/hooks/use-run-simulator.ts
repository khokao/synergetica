import { usePanelContext } from "@/components/circuit/resizable-panel/resizable-panel-context";
import { useConverter } from "@/components/simulation/contexts/converter-context";
import { callCircuitConverterAPI } from "@/components/simulation/hooks/use-simulator-api";
import { useReactFlow } from "@xyflow/react";
import { produce } from "immer";

export const useSimulate = () => {
  const reactflow = useReactFlow();
  const { openPanels, togglePanel } = usePanelContext();
  const { setConvertResult } = useConverter();

  const handleRunSimulate = async () => {
    const panelPosition = "right";
    const isOpen = openPanels[panelPosition];

    if (!isOpen) {
      togglePanel(panelPosition);
    }

    try {
      const requestData = {
        reactflowObjectJsonStr: JSON.stringify(reactflow.toObject()),
      };
      const responseData = await callCircuitConverterAPI(requestData);
      setConvertResult(responseData);

      const { getNodes, setNodes } = reactflow;
      const nodes = getNodes();

      const newNodes = produce(nodes, (draft) => {
        for (const node of draft) {
          node.data.simulationTargetHighlight = undefined;
          node.selected = false;
        }

        Object.keys(responseData.protein_id2name).forEach((id, index) => {
          const node = draft.find((node) => node.id === id);
          if (node) {
            node.data.simulationTargetHighlight = `hsl(var(--chart-${(index % 5) + 1}))`;
          }
        });
      });

      setNodes(newNodes);
    } catch (error) {
      console.error("Simulation failed:", error);
    }
  };

  const handleResetSimulate = () => {
    const { getNodes, setNodes } = reactflow;
    const nodes = getNodes();

    const newNodes = produce(nodes, (draft) => {
      for (const node of draft) {
        node.data.simulationTargetHighlight = undefined;
      }
    });

    setNodes(newNodes);
    setConvertResult(null);
  };

  return { handleRunSimulate, handleResetSimulate };
};
