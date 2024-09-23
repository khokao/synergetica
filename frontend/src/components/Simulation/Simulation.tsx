import { GenerationButtons } from "@/components/Generation/GenerationButtons";
import { Graph } from "@/components/Simulation/DrawSimulationResult";
import type { ConverterResponseData } from "@/interfaces/simulatorAPI";
import type React from "react";
import type { Dispatch, SetStateAction } from "react";

type SimulationProps = {
  ConvertResult: ConverterResponseData;
  reseter: () => void;
  simulatorResult: { [key: string]: number };
  setSimulatorResult: Dispatch<SetStateAction<{ [key: string]: number }>>;
};

export const Simulation: React.FC<SimulationProps> = ({
  ConvertResult,
  reseter,
  SimulatorResult,
  setSimulatorResult,
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center h-full">
        <Graph convertResult={convertResult} setSimulatorResult={setSimulatorResult} />
      </div>
      <div className="flex justify-end">
        <button type="button" onClick={reseter} className="px-4 py-1 border-2 border-black rounded mr-4">
          Reset
        </button>
      </div>
      <GenerationButtons simulatorResult={simulatorResult} />
    </div>
  );
};
