import React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useConverter } from "@/components/simulation/contexts/converter-context";
import { useWebSocketSimulation } from "@/components/simulation/hooks/use-websocket-simulation";
import { useProteinParameters } from "@/components/simulation/contexts/protein-parameter-context";
import { MIN_SLIDER_PARAM, MAX_SLIDER_PARAM } from "@/components/simulation/constants";

export const Sliders: React.FC = () => {
  const { convertResult } = useConverter();

  if (!convertResult) {
    return null;
  }

  const { proteinParameter, handleProteinParamChange } = useProteinParameters();
  useWebSocketSimulation(proteinParameter);

  const proteinEntries = Object.entries(convertResult.protein_id2name);

  return (
    <Card className="h-full border-0 shadow-none pt-4">
      <CardContent className="h-full">
        <ScrollArea className="h-full">
          {proteinEntries.map(([id, name], index) => (
            <div
              key={id}
              className="flex items-center mb-4 pr-4"
            >
              <Label htmlFor={`slider-${id}`} className="w-40 pr-2 flex items-center">
                <span
                  className="inline-block w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: `hsl(var(--chart-${(index % 5) + 1}))` }}
                />
                {name}
              </Label>
              <Slider
                id={`slider-${id}`}
                min={MIN_SLIDER_PARAM}
                max={MAX_SLIDER_PARAM}
                step={1}
                value={[proteinParameter[id]]}
                onValueChange={handleProteinParamChange(id)}
                className="w-full"
              />
              <span className="w-24 text-right">{proteinParameter[id]}</span>
            </div>
          ))}
          <ScrollBar />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
