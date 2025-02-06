import { MAX_SLIDER_PARAM, MIN_SLIDER_PARAM } from "@/components/simulation/constants";
import { useSimulator } from "@/components/simulation/simulator-context";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { useCallback, useMemo } from "react";
import { Fragment } from "react";

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

  const handleInputChange = useCallback(
    (id: string) => (e) => {
      const newVal = Number(e.target.value);
      if (!Number.isNaN(newVal)) {
        const clampedVal = Math.max(MIN_SLIDER_PARAM, Math.min(MAX_SLIDER_PARAM, newVal));
        setProteinParameters((prev) => ({ ...prev, [id]: clampedVal }));
      }
    },
    [setProteinParameters],
  );

  const sliderList = useMemo(() => {
    return Object.keys(proteinParameters).map((id, index) => {
      const name = proteinIdToName[id];
      const indexInGroup = proteinName2Ids[name].indexOf(id);
      const displayName = proteinName2Ids[name].length === 1 ? name : `${name} [${indexInGroup + 1}]`;

      return (
        <Fragment key={id}>
          <Label htmlFor={`slider-${id}`} className="max-w-[88px] flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: `hsl(var(--chart-${(index % 5) + 1}))` }}
            />
            <span className="text-ellipsis overflow-hidden">{displayName}</span>
          </Label>

          <Slider
            id={`slider-${id}`}
            min={MIN_SLIDER_PARAM}
            max={MAX_SLIDER_PARAM}
            step={1}
            value={[proteinParameters[id]]}
            onValueChange={handleSliderChange(id)}
            className="w-full min-w-6"
            aria-label={displayName}
          />

          <Input
            id={`input-${id}`}
            type="number"
            className="w-[68px] flex-shrink-0 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            min={MIN_SLIDER_PARAM}
            max={MAX_SLIDER_PARAM}
            step={1}
            value={proteinParameters[id]}
            onChange={handleInputChange(id)}
          />
        </Fragment>
      );
    });
  }, [proteinParameters, proteinName2Ids, proteinIdToName, handleSliderChange, handleInputChange]);

  return (
    <Card className="h-full border-0 shadow-none pt-4">
      <CardContent className="h-full">
        <ScrollArea className="h-full overflow-x-hidden">
          <div className="grid grid-cols-[auto,1fr,auto] items-center gap-x-4 gap-y-2">{sliderList}</div>
          <ScrollBar />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
