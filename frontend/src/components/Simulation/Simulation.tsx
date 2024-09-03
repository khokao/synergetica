import { Graph } from "@/components/Simulation/DrawSimulationResult";
import { GenerationButtons } from "@/components/Simulation/GenerationButtons";
import type React from "react";

export const Simulation: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow">Simulation Section</div>
      <div className="flex justify-center">
        <Graph />
      </div>
      <GenerationButtons />
    </div>
  );
};
