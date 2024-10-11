// src/components/simulation/simulation.tsx
import React, { useMemo } from "react";
import { Chart } from "@/components/simulation/chart";
import { Sliders } from "@/components/simulation/sliders";
import { Button } from "@/components/ui/button";
import { useConverter } from "@/components/simulation/contexts/converter-context";
import { useProteinParameters } from "@/components/simulation/hooks/use-protein-parameters";
import { useWebSocketSimulation } from "@/components/simulation/hooks/use-websocket-simulation";
import { useSimulator } from "@/components/simulation/contexts/simulator-context";

export const Simulation: React.FC = () => {
  const { convertResult } = useConverter();
  const { simulationData } = useSimulator();

  const { proteinParameter, handleProteinParamChange } = useProteinParameters(convertResult);

  useWebSocketSimulation(proteinParameter);

  const proteinNames = useMemo(() => {
    return convertResult ? Object.values(convertResult.proteins) : [];
  }, [convertResult]);

  const chartData = useMemo(() => {
    if (simulationData && convertResult) {
      return simulationData.map((row) => {
        const dataPoint: { [key: string]: number } = { time: row[0] };
        proteinNames.forEach((name, index) => {
          dataPoint[name] = row[index + 1];
        });
        return dataPoint;
      });
    } else {
      return [];
    }
  }, [simulationData, convertResult, proteinNames]);

  return (
    <div className="flex flex-col w-full h-full">
      {convertResult && chartData.length > 0 ? (
        <div className="flex flex-col flex-grow">
          <div className="h-[45vh]">
            <Chart chartData={chartData} proteinNames={proteinNames} />
          </div>
          <div className="h-[40vh]">
            <Sliders
              proteinParameter={proteinParameter}
              handleProteinParamChange={handleProteinParamChange}
              proteinNames={proteinNames}
            />
          </div>
          <div className="h-[10vh] flex items-center justify-center">
            <Button className="mt-4">Run</Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center flex-grow text-center">
          <span>No results found.</span>
        </div>
      )}
    </div>
  );
};
