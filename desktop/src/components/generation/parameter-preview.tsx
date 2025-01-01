import { MAX_SLIDER_PARAM, MIN_SLIDER_PARAM } from "@/components/simulation/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import type { Node } from "@xyflow/react";

export const ParameterPreview = ({
  nodes,
  proteinParameters,
}: { nodes: Node[]; proteinParameters: Record<string, number> }) => {
  const proteins = nodes
    .filter((node) => node.data.category === "Protein")
    .map((node) => ({
      id: node.id,
      name: node.data.name as string,
      parameter: proteinParameters[node.id],
    }));

  return (
    <Card className="h-full border-0 shadow-none pt-4">
      <CardContent className="h-full">
        <ScrollArea className="h-full">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {proteins.map(({ id, name, parameter }, index) => (
              <div key={id} className="flex items-center gap-4 pr-4">
                <Label htmlFor={`slider-${id}`} className="w-40 flex items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: `hsl(var(--chart-${(index % 5) + 1}))` }}
                  />
                  {name}
                </Label>
                <Slider
                  id={`slider-${id}`}
                  min={MIN_SLIDER_PARAM}
                  max={MAX_SLIDER_PARAM}
                  step={1}
                  defaultValue={[parameter]}
                  disabled
                  className="w-full"
                />
                <span className="w-24 text-right">{parameter}</span>
              </div>
            ))}
          </div>
          <ScrollBar />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
