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
import useSWRMutation from "swr/mutation";

interface SnapshotData {
  nodes: Node[];
  edges: Edge[];
  proteinParameter: { [id: string]: number };
}

export const useGeneratorData = () => {
  const [snapshot, setSnapshot] = useState<SnapshotData | null>(null);
  const reactflow = useReactFlow();
  const { proteinParameter } = useProteinParameters();

  const generatorFetcher = async (
    key: string,
    { arg }: { arg: GeneratorRequestData },
  ): Promise<GeneratorResponseData> => {
    return await callGeneratorAPI(arg);
  };

  const { data, trigger, isMutating, reset } = useSWRMutation<
    GeneratorResponseData,
    Error,
    string,
    GeneratorRequestData
  >("call_generator_api", generatorFetcher, {
    revalidate: false,
    populateCache: false,
  });

  const generate = () => {
    reset();

    const { getNodes, getEdges } = reactflow;
    const nodes = getNodes();
    const edges = getEdges();

    const currentProteinParameter = { ...proteinParameter };

    setSnapshot({
      nodes,
      edges,
      proteinParameter: currentProteinParameter,
    });

    const generatorRequestData: GeneratorRequestData = {
      reactflowObjectJsonStr: JSON.stringify(reactflow.toObject()),
      rbsTargetParameters: currentProteinParameter,
    };

    return trigger(generatorRequestData);
  };

  const cancel = () => {
    cancelGeneratorAPI();
  };

  return {
    data,
    snapshot,
    isMutating,
    generate,
    cancel,
  };
};
