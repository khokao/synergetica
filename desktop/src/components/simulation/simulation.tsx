import { useEditorContext } from "@/components/editor/editor-context";
import { GenerationButtons } from "@/components/generation/generation";
import { Chart } from "@/components/simulation/chart";
import { useSimulator } from "@/components/simulation/simulator-context";
import { Sliders } from "@/components/simulation/sliders";
import { Separator } from "@/components/ui/separator";

const Message = ({ lines }: { lines: string[] }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      {lines.map((line) => (
        <p key={line} className="text-center">
          {line}
        </p>
      ))}
    </div>
  );
};

export const Simulation = () => {
  const { validationError } = useEditorContext();
  const { solutions } = useSimulator();

  if (validationError === null) {
    return (
      <div className="flex items-center justify-center h-full">
        <Message lines={["Empty circuit.", "Build the circuit first."]} />
      </div>
    );
  }

  if (validationError.length > 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Message lines={["Invalid circuit.", "Please check the validation error."]} />
      </div>
    );
  }

  if (solutions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Message lines={["No simulation data.", "Click 'Simulate' button."]} />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col flex-grow">
        <div className="h-[50%]">
          <Chart />
        </div>
        <div className="h-[35%]">
          <Sliders />
        </div>
        <Separator orientation="horizontal" />
        <div className="h-[15%]">
          <GenerationButtons />
        </div>
      </div>
    </div>
  );
};
