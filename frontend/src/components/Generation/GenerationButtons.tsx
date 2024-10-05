import { GenerationResult } from "@/components/Generation/GenerationResult";
import { callGeneratorAPI, cancelGeneratorAPI } from "@/hooks/useGeneratorAPI";
import type { GeneratorRequestData, GeneratorResponseData } from "@/interfaces/generatorAPI";
import { DocumentIcon, PlayIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { type Edge, type Node, useReactFlow } from "@xyflow/react";
import type React from "react";
import { useState } from "react";
import useSWRMutation from "swr/mutation";

export const GenerationButtons: React.FC<{ simulatorResult: { [key: string]: number } }> = ({ simulatorResult }) => {
  const reactFlow = useReactFlow();
  const [reactFlowNodes, setReactFlowNodes] = useState<Node[]>([]);
  const [reactFlowEdges, setReactFlowEdges] = useState<Edge[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Fetcher is defined here to keep the logic for interacting with SWR separate from the pure API call logic.
  const generatorFetcher = async (
    key: string,
    { arg }: { arg: GeneratorRequestData },
  ): Promise<GeneratorResponseData> => {
    return await callGeneratorAPI(arg);
  };

  const { data, trigger, isMutating } = useSWRMutation<GeneratorResponseData, Error, string, GeneratorRequestData>(
    "call_generator_api",
    generatorFetcher,
    {
      revalidate: false,
      populateCache: false,
    },
  );

  const onPlayClick = async () => {
    setReactFlowNodes(reactFlow.getNodes());
    setReactFlowEdges(reactFlow.getEdges());

    const generatorRequestData: GeneratorRequestData = {
      reactflow_object_json_str: JSON.stringify(reactFlow.toObject()),
      rbs_target_parameters: simulatorResult,
    };

    try {
      await trigger(generatorRequestData);
    } catch (error) {
      console.error("Error occurred while calling generator API:", error);
    }
  };

  const onStopClick = () => {
    cancelGeneratorAPI();
  };

  const onCheckClick = () => {
    setIsOpen(true);
  };

  return (
    <div className="flex justify-center space-x-3 pb-2">
      <button
        type="button"
        onClick={onPlayClick}
        className={`flex items-center justify-center w-26 px-2 py-1.5 border-2 rounded
          ${isMutating ? "border-green-500 text-green-500 cursor-not-allowed" : "border-green-600 text-green-600 hover:bg-green-100"}
        `}
        disabled={isMutating}
      >
        {isMutating ? (
          <>
            <div className="animate-spin h-3.5 w-3.5 mr-2 border-2 border-solid border-green-500 rounded-full border-t-transparent" />
            <span>Generating</span>
          </>
        ) : (
          <>
            <PlayIcon className="h-4 w-4 mr-2" />
            <span>Generate</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={onStopClick}
        className={`flex items-center justify-center w-26 px-2 py-1.5 border-2 rounded
          ${!isMutating ? "border-gray-400 text-gray-400 cursor-not-allowed" : "border-red-600 text-red-600 hover:bg-red-100"}
        `}
        disabled={!isMutating}
      >
        <XMarkIcon className="h-4 w-4 mr-2" />
        <span>Cancel</span>
      </button>

      <button
        type="button"
        onClick={onCheckClick}
        className={`flex items-center justify-center w-26 px-2 py-1.5 border-2 rounded
          ${!data ? "border-gray-400 text-gray-400 cursor-not-allowed" : "border-blue-600 text-blue-600 hover:bg-blue-100"}
        `}
        disabled={!data}
      >
        <DocumentIcon className="h-4 w-4 mr-2" />
        <span>Show</span>
      </button>

      <GenerationResult
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        reactFlowNodes={reactFlowNodes}
        reactFlowEdges={reactFlowEdges}
        data={data}
      />
    </div>
  );
};
