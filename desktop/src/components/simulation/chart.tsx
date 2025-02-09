import { useSimulator } from "@/components/simulation/simulator-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";
import { CartesianGrid, Label, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface CustomTooltipProps {
  active?: boolean;
  payload?: { color: string; name: string; value: number }[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-300 p-2 rounded shadow-lg">
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }} className="text-sm">
          {entry.name}: {entry.value.toPrecision(3)}
        </p>
      ))}
    </div>
  );
};

export const Chart = () => {
  const { solutions, proteinName2Ids, proteinParameters } = useSimulator();

  if (solutions.length === 0) {
    return null;
  }

  const paramKeys = Object.keys(proteinParameters);

  const nameColorIndices = useMemo(() => {
    const colorIndices: Record<string, number> = {};
    for (const [name, ids] of Object.entries(proteinName2Ids)) {
      let minIndex = Number.MAX_SAFE_INTEGER;
      for (const id of ids) {
        const idx = paramKeys.indexOf(id);
        if (idx !== -1 && idx < minIndex) {
          minIndex = idx;
        }
      }
      colorIndices[name] = minIndex === Number.MAX_SAFE_INTEGER ? 0 : minIndex;
    }
    return colorIndices;
  }, [proteinName2Ids, paramKeys]);

  const uniqueNames = useMemo(() => Object.keys(proteinName2Ids), [proteinName2Ids]);

  const chartLines = uniqueNames.map((name) => {
    const ids = proteinName2Ids[name];
    const colorIndex = nameColorIndices[name];

    let legendLabel = name;
    if (ids.length > 1) {
      const numbering = ids.map((_, i) => i + 1).join(",");
      legendLabel = `${name} [${numbering}]`;
    }

    return (
      <Line
        key={name}
        type="monotone"
        dataKey={name}
        name={legendLabel}
        stroke={`hsl(var(--chart-${(colorIndex % 5) + 1}))`}
        strokeWidth={2}
        dot={false}
      />
    );
  });

  return (
    <Card className="h-full border-0 shadow-none pt-2 tabular-nums" data-testid="chart-card">
      <CardHeader className="flex justify-center items-center p-0 h-[10%]">
        <CardTitle className="text-xl space-x-2 tracking-wide">
          <span>Simulation</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex h-[90%] py-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={solutions} className="h-full">
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="time" tick={false}>
              <Label value="Time" position="insideBottomRight" />
            </XAxis>

            <YAxis>
              <Label value="Protein Levels" angle={-90} offset={5} position="insideLeft" />
            </YAxis>

            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {chartLines}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
