import { Graph } from "@/components/Simulation/DrawSimulationResultDynamic";
import { callGeneratorAPI } from "@/hooks/useGeneratorAPI";
import { ConverterResponseData } from "@/interfaces/simulatorAPI";
import type React from "react";
import useSWR from "swr";

export const Simulation: React.FC<{ result: ConverterResponseData, reseter: () => void }> = ({ result, reseter }) => {
  const { mutate } = useSWR("call_generator_api");

  const onCallGeneratorAPIClick = async () => {
    const generatorRequestData = {
      rbs_parameter: 0.5,
      rbs_upstream: "ATG",
      rbs_downstream: "TAA",
      promoter_parameter: 0.5,
      promoter_upstream: "TATA",
    };

    const response = await callGeneratorAPI(generatorRequestData);
    await mutate(response, false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center h-full">
        <Graph result={result} />
      </div>
      <div className="flex justify-end mb-4">
        <button type="button" onClick={reseter} className="px-4 py-1 border-2 border-black rounded mr-4">
          Reset
        </button>
        <button type="button" onClick={onCallGeneratorAPIClick} className="px-4 py-1 border-2 border-black rounded mr-6">
          Generate
        </button>
      </div>
    </div>
  );
};
