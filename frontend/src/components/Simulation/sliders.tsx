// src/components/simulation/sliders.tsx
import React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface SlidersComponentProps {
  proteinParameter: number[];
  handleProteinParamChange: (index: number) => (value: number[]) => void;
  proteinNames: string[];
}

export const Sliders: React.FC<SlidersComponentProps> = ({
  proteinParameter,
  handleProteinParamChange,
  proteinNames,
}) => {
  return (
    <Card className="h-full border-0">
      <CardContent className="h-full">
        <ScrollArea className="h-full">
          {proteinParameter.map((param, index) => (
            <div
              key={proteinNames[index]}
              className="flex items-center mb-4 pr-4"
            >
              <Label htmlFor={`slider-${index}`} className="w-28 pr-2">
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
