import React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useConverter } from "@/components/simulation/contexts/converter-context";
import { useProteinParameters } from "@/components/simulation/hooks/use-protein-parameters";
import { useWebSocketSimulation } from "@/components/simulation/hooks/use-websocket-simulation";


export const Sliders: React.FC = () => {
  const { convertResult } = useConverter();

  if (!convertResult) {
    return null;
  }

  const { proteinParameter, handleProteinParamChange } = useProteinParameters();
  useWebSocketSimulation(proteinParameter);

  const proteinNames = Object.values(convertResult.protein_id2name);

  return (
    <Card className="h-full border-0 shadow-none">
      <CardContent className="h-full">
        <ScrollArea className="h-full">
          {proteinParameter.map((param, index) => (
            <div
              key={proteinNames[index]}
              className="flex items-center mb-4 pr-4"
            >
              <Label htmlFor={`slider-${index}`} className="w-40 pr-2 flex items-center">
                <span
                  className="inline-block w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: `hsl(var(--chart-${(index % 5) + 1}))` }}
                />
                {proteinNames[index]}
              </Label>
              <Slider
                id={`slider-${index}`}
                min={1}
                max={1000}
                step={1}
                value={[param]}
                onValueChange={handleProteinParamChange(index)}
                className="w-full"
              />
              <span className="w-20 text-right">{param}</span>
            </div>
          ))}
          <ScrollBar />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
