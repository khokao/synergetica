import { useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import useSWRMutation from 'swr/mutation';
import { callGeneratorAPI, cancelGeneratorAPI, GeneratorRequestData, GeneratorResponseData } from '@/components/generation/hooks/use-generator-api';
import { useProteinParameters } from '@/components/simulation/contexts/protein-parameter-context';
import { Node, Edge } from '@xyflow/react';

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

  const { data, trigger, isMutating, reset } = useSWRMutation<GeneratorResponseData, Error, string, GeneratorRequestData>(
    'call_generator_api',
    generatorFetcher,
    {
      revalidate: false,
      populateCache: false,
    },
  );

  const generate = async () => {
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
      reactflow_object_json_str: JSON.stringify(reactflow.toObject()),
      rbs_target_parameters: currentProteinParameter,
    };

    try {
      await trigger(generatorRequestData);
    } catch (error) {
      console.error('Error occurred while calling generator API:', error);
    }
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
