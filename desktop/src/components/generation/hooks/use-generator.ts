import {
  type GeneratorRequestData,
  type GeneratorResponseData,
  callGeneratorAPI,
  cancelGeneratorAPI,
} from "@/components/generation/hooks/use-generator-api";
import { useSimulator } from "@/components/simulation/simulator-context";
import { useReactFlow } from "@xyflow/react";
import type { Edge, Node } from "@xyflow/react";
import { useState } from "react";

export interface SnapshotData {
  nodes: Node[];
  edges: Edge[];
  proteinParameters: Record<string, number>;
}

export const useGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const { getNodes, getEdges } = useReactFlow();
  const { proteinParameters } = useSimulator();

  const generate = async (): Promise<{
    snapshot: SnapshotData;
    response: GeneratorResponseData;
  }> => {
    setIsGenerating(true);

    try {
      const nodes = getNodes();
      const edges = getEdges();
      const currentProteinParameters = { ...proteinParameters };

      const snapshot: SnapshotData = {
        nodes,
        edges,
        proteinParameters: currentProteinParameters,
      };

      const requestData: GeneratorRequestData = {
        proteinTargetValues: currentProteinParameters,
      };

      const response = await callGeneratorAPI(requestData);

      return { snapshot, response };
    } finally {
      setIsGenerating(false);
    }
  };

  const cancel = async () => {
    try {
      await cancelGeneratorAPI();
    } catch (error) {
      console.error("Cancel error:", error);
    }
  };

  return {
    generate,
    cancel,
    isGenerating,
  };
};
