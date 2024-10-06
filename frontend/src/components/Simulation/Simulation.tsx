
import React from "react";
import { Chart } from "@/components/simulation/chart"
import { Sliders } from "@/components/simulation/sliders"
import { useSimulationData } from "@/components/simulation/hooks";

export const Simulation: React.FC = () => {
  const {
    proteinParameter,
    handleProteinParamChange,
    proteinNames,
    chartData,
    convertResult,
  } = useSimulationData();

  return (
    <div className="flex flex-col w-full h-full space-y-4">
      {convertResult && chartData.length > 0 ? (
        <div className="flex-grow overflow-auto">
          <Chart chartData={chartData} proteinNames={proteinNames} />
          <Sliders
            proteinParameter={proteinParameter}
            handleProteinParamChange={handleProteinParamChange}
            proteinNames={proteinNames}
          />
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-full text-center">
          <span>No results found.</span>
        </div>
      )}
    </div>
  );
};
