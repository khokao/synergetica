import { MAX_SLIDER_PARAM, MIN_SLIDER_PARAM } from "@/components/simulation/constants";
import { useSimulator } from "@/components/simulation/simulator-context";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { useCallback, useMemo } from "react";

export const Sliders = () => {
  const { proteinName2Ids, proteinParameters, setProteinParameters } = useSimulator();

  const proteinIdToName = useMemo(() => {
    const mapping: Record<string, string> = {};
    for (const [name, ids] of Object.entries(proteinName2Ids)) {
      for (const id of ids) {
        mapping[id] = name;
      }
    }
    return mapping;
  }, [proteinName2Ids]);

  const handleSliderChange = useCallback(
    (id: string) => (value: number[]) => {
      setProteinParameters((prev) => ({ ...prev, [id]: value[0] }));
    },
    [setProteinParameters],
  );

  const sliderList = useMemo(() => {
    return Object.keys(proteinParameters).map((id, index) => {
      const name = proteinIdToName[id];
      const indexInGroup = proteinName2Ids[name].indexOf(id);
      const displayName = proteinName2Ids[name].length === 1 ? name : `${name} [${indexInGroup + 1}]`;

      return (
        <div key={id} className="flex items-center gap-4 pr-4 mb-2">
          <Label htmlFor={`slider-${id}`} className="w-40 flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: `hsl(var(--chart-${(index % 5) + 1}))` }}
            />
            {displayName}
          </Label>

          <Slider
            id={`slider-${id}`}
            min={MIN_SLIDER_PARAM}
            max={MAX_SLIDER_PARAM}
            step={1}
            value={[proteinParameters[id]]}
            onValueChange={handleSliderChange(id)}
            className="w-full"
            aria-label={displayName}
          />

          <span className="w-24 text-right">{proteinParameters[id]}</span>
        </div>
      );
    });
  }, [proteinParameters, proteinName2Ids, proteinIdToName, handleSliderChange]);

  return (
    <Card className="h-full border-0 shadow-none pt-4">
      <CardContent className="h-full">
        <ScrollArea className="h-full">
          {sliderList}
          <ScrollBar />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
