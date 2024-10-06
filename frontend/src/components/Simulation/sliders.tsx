import React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

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
    <Card className="w-full">
      <CardContent className="flex flex-col space-y-4">
        {proteinParameter.map((param, index) => (
          <div key={proteinNames[index]} className="flex items-center space-x-4">
            <Label htmlFor={`slider-${index}`}>{proteinNames[index]}</Label>
            <Slider
              id={`slider-${index}`}
              min={1}
              max={1000}
              step={1}
              value={[param]}
              onValueChange={handleProteinParamChange(index)}
              className="w-full"
            />
            <span>{param}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
