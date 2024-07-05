import { Graph } from "@/components/Simulation/DrawSimulationResult";
import { callGeneratorAPI } from "@/hooks/useGeneratorAPI";
import type React from "react";
import useSWR from "swr";

export const Simulation: React.FC = () => {
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
      <div className="flex-grow">Simulation Section</div>
      <div className="flex justify-center h-full">
        <Graph />
      </div>
      <div className="flex justify-center mb-4">
        <button type="button" onClick={onCallGeneratorAPIClick} className="px-4 py-1 border-2 border-black rounded">
          Generate
        </button>
      </div>
    </div>
  );
};
