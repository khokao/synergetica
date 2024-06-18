import { useResponse } from "@/context/GeneratorResponseContext";
import type React from "react";

export const Simulation: React.FC = () => {
  const { callGeneratorAPI } = useResponse();

  const onCallGeneratorAPIClick = () => {
    const generatorRequestData = {
      rbs_parameter: 0.5,
      rbs_upstream: "ATG",
      rbs_downstream: "TAA",
      promoter_parameter: 0.5,
      promoter_upstream: "TATA",
    };
    callGeneratorAPI(generatorRequestData);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow">Simulation Section</div>
      <div className="flex justify-center mb-4">
        <button type="button" onClick={onCallGeneratorAPIClick} className="px-4 py-1 border-2 border-black rounded">
          Generate
        </button>
      </div>
    </div>
  );
};
