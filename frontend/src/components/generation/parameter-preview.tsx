import { MAX_SLIDER_PARAM, MIN_SLIDER_PARAM } from "@/components/simulation/constants";
import { useConverter } from "@/components/simulation/contexts/converter-context";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import type React from "react";


export const ParameterPreview = ({ snapshot }) => {
  if (!snapshot) return null;

  const { proteinParameter } = snapshot;
  const { convertResult } = useConverter();

  if (!convertResult) {
    return null;
  }

  const proteinEntries = Object.entries(convertResult.protein_id2name);

  return (
    <Card className="h-full border-0 shadow-none pt-4">
      <CardContent className="h-full">
        <ScrollArea className="h-full">
          <div className="grid grid-cols-2 gap-4">
            {proteinEntries.map(([id, name], index) => (
              <div key={id} className="flex items-center mb-4 pr-4">
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
                  defaultValue={[proteinParameter[id]]}
                  disabled
                  className="w-full"
                />
                <span className="w-20 text-right">{proteinParameter[id]}</span>
              </div>
            ))}
          </div>
          <ScrollBar />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
