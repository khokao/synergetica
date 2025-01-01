import {
  type GeneratorRequestData,
  type GeneratorResponseData,
  callGeneratorAPI,
  cancelGeneratorAPI,
} from "@/components/generation/hooks/use-generator-api";
import { useProteinParameters } from "@/components/simulation/contexts/protein-parameter-context";
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
  const { proteinParameter } = useProteinParameters();

  const generate = async (): Promise<{
    snapshot: SnapshotData;
    response: GeneratorResponseData;
  }> => {
    setIsGenerating(true);

    try {
      const nodes = getNodes();
      const edges = getEdges();
      const currentProteinParameters = { ...proteinParameter };

      const snapshot: SnapshotData = {
        nodes,
        edges,
        proteinParameters: currentProteinParameters,
      };

      const proteinInitSequences = nodes
        .filter((node) => node.data.category === "Protein")
        .reduce((acc, node) => {
          acc[node.id] = node.data.sequence;
          return acc;
        }, {});

      const requestData: GeneratorRequestData = {
        proteinTargetValues: currentProteinParameters,
        proteinInitSequences: proteinInitSequences,
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
