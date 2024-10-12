import { useState } from 'react';
import { useReactFlow } from "@xyflow/react";
import type { Node, Edge } from '@xyflow/react';
import useSWRMutation from "swr/mutation";
import { Play, Ban, Dna, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { callGeneratorAPI, cancelGeneratorAPI, GeneratorRequestData, GeneratorResponseData } from "@/components/generation/hooks/use-generator-api";
import { GenerationResultModal } from "@/components/generation/generation-result-modal";
import { useProteinParameters } from "@/components/simulation/contexts/protein-parameter-context";

interface SnapshotData {
  nodes: Node[];
  edges: Edge[];
  proteinParameter: { [id: string]: number };
}

export const GenerationButtons = () => {
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
    "call_generator_api",
    generatorFetcher,
    {
      revalidate: false,
      populateCache: false,
    },
  );

  const handlePlayClick = async () => {
    reset();

    const { getNodes, getEdges } = reactflow;
    const nodes = getNodes();
    const edges = getEdges();

    const currentProteinParameter = { ...proteinParameter };

    setSnapshot({
      nodes: nodes,
      edges: edges,
      proteinParameter: currentProteinParameter,
    });

    const generatorRequestData: GeneratorRequestData = {
      reactflow_object_json_str: JSON.stringify(reactflow.toObject()),
      rbs_target_parameters: currentProteinParameter,
    };

    try {
      await trigger(generatorRequestData);
    } catch (error) {
      console.error("Error occurred while calling generator API:", error);
    }
  };

  const handleCancelClick = () => {
    cancelGeneratorAPI();
  };

  return (
    <div className="flex justify-center items-center space-x-4">
      <Button
        size="icon"
        onClick={handlePlayClick}
        disabled={isMutating}
      >
        {isMutating ? (
          <Loader2 className='w-5 h-5 animate-spin'/>
        ) : (
          <Play className='w-5 h-5'/>
        )}
      </Button>
      <Button
        size="icon"
        disabled={!isMutating}
        onClick={handleCancelClick}
      >
        <Ban className='w-5 h-5'/>
      </Button>
      <GenerationResultModal data={data} snapshot={snapshot} />
    </div>
  );
};
