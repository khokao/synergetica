import { Graph } from "@/components/Simulation/DrawSimulationResult";
import { GenerationButtons } from "@/components/Simulation/GenerationButtons";
import type { ConverterResponseData } from "@/interfaces/simulatorAPI";
import type React  from "react";
import { Dispatch, SetStateAction } from "react";



export const Simulation: React.FC<{ ConvertResult: ConverterResponseData; reseter: () => void; proteinParameter:number[],setproteinParameter:Dispatch<SetStateAction<number[]>>}> = ({
  ConvertResult,
  reseter,
  proteinParameter,
  setproteinParameter
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center h-full">
        <Graph ConvertResult={ConvertResult} proteinParameter={proteinParameter} setproteinParameter={setproteinParameter} />
      </div>
      <div className="flex justify-end mb-4">
        <button type="button" onClick={reseter} className="px-4 py-1 border-2 border-black rounded mr-4">
          Reset
        </button>
      </div>
      <GenerationButtons proteinParameter={proteinParameter} />
    </div>
  );
};
