import React from "react";
import { Chart } from "@/components/simulation/chart";
import { Sliders } from "@/components/simulation/sliders";
import { useConverter } from "@/components/simulation/contexts/converter-context";
import { useSimulator } from "@/components/simulation/contexts/simulator-context";
import { GenerationButtons } from "@/components/generation/generation-buttons";


const Message: React.FC<{ lines: string[] }> = ({ lines }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      {lines.map((line, index) => (
        <p key={index} className="text-center">
          {line}
        </p>
      ))}
    </div>
  );
};


export const Simulation: React.FC = () => {
  const { convertResult } = useConverter();
  const { simulationResult } = useSimulator();

  if (!convertResult) {
    return (
      <div className="flex items-center justify-center h-full">
        <Message lines={["Build the circuit", "and run the simulation."]} />
      </div>
    );
  }

  if (!convertResult.valid) {
    return (
      <div className="flex items-center justify-center h-full">
        <Message lines={["Invalid circuit.", "Please check and retry."]} />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col flex-grow">
        <div className="h-[50vh]">
          <Chart />
        </div>
        <div className="h-[35vh]">
          <Sliders />
        </div>
        <div className="h-[10vh]">
          <GenerationButtons/>
        </div>
      </div>
    </div>
  );
};
