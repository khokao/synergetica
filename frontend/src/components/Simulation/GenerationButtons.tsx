import { GenerationResult } from "@/components/Simulation/GenerationResult";
import { callGeneratorAPI, cancelGeneratorAPI } from "@/hooks/useGeneratorAPI";
import { DocumentIcon, PlayIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type React from "react";
import { useState } from "react";
import { type Edge, type Node, useReactFlow } from "reactflow";
import useSWR from "swr";

export const GenerationButtons: React.FC<{ SimulatorResult: { [key: string]: number } }> = ({ SimulatorResult }) => {
  const reactFlow = useReactFlow();
  const [reactFlowNodes, setReactFlowNodes] = useState<Node[]>([]);
  const [reactFlowEdges, setReactFlowEdges] = useState<Edge[]>([]);

  const { data, mutate, isValidating } = useSWR(
    "call_generator_api",
    async () => {
      const generatorRequestData = {
        reactflow_object_json_str: JSON.stringify(reactFlow.toObject()),
        rbs_target_parameters: SimulatorResult,
      };
      const response = await callGeneratorAPI(generatorRequestData);
      return response;
    },
    {
      // https://swr.vercel.app/docs/api#options
      suspense: false,
      fallbackData: null,
      revalidateIfStale: false,
      revalidateOnMount: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    },
  );

  const [isOpen, setIsOpen] = useState(false);

  const onPlayClick = async () => {
    setReactFlowNodes(reactFlow.getNodes());
    setReactFlowEdges(reactFlow.getEdges());
    await mutate();
    console.log(data);
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
          ${isValidating ? "border-green-500 text-green-500 cursor-not-allowed" : "border-green-600 text-green-600 hover:bg-green-100"}
        `}
        disabled={isValidating}
      >
        {isValidating ? (
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
          ${!isValidating ? "border-gray-400 text-gray-400 cursor-not-allowed" : "border-red-600 text-red-600 hover:bg-red-100"}
        `}
        disabled={!isValidating}
      >
        <XMarkIcon className="h-4 w-4 mr-2" />
        <span>Cancel</span>
      </button>

      <button
        type="button"
        onClick={onCheckClick}
        className={`flex items-center justify-center w-26 px-2 py-1.5 border-2 rounded
          ${data === null ? "border-gray-400 text-gray-400 cursor-not-allowed" : "border-blue-600 text-blue-600 hover:bg-blue-100"}
        `}
        disabled={data === null}
      >
        <DocumentIcon className="h-4 w-4 mr-2" />
        <span>Show</span>
      </button>

      <GenerationResult
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        reactFlowNodes={reactFlowNodes}
        reactFlowEdges={reactFlowEdges}
      />
    </div>
  );
};
