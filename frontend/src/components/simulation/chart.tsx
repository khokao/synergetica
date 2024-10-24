import { useConverter } from "@/components/simulation/contexts/converter-context";
import { useSimulator } from "@/components/simulation/contexts/simulator-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type React from "react";
import { CartesianGrid, Label, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface CustomTooltipProps {
  active?: boolean;
  payload?: { color: string; name: string; value: number }[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-300 p-2 rounded shadow-lg">
        {payload.map((entry) => (
          <p key={entry.name} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value.toPrecision(3)}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

export const Chart: React.FC = () => {
  const { convertResult } = useConverter();
  const { simulationResult } = useSimulator();

  if (!convertResult || !simulationResult) {
    return null;
  }

  const proteinNames = Object.values(convertResult.protein_id2name);
  const chartData = simulationResult.map((row) => {
    const dataPoint: { [key: string]: number } = { time: row[0] };
    proteinNames.forEach((name, index) => {
      dataPoint[name] = row[1 + 2 * index];
    });
    return dataPoint;
  });

  return (
    <Card className="h-full border-0 shadow-none pt-2" data-testid="chart-card">
      <CardHeader className="flex justify-center items-center p-0 h-[10%]">
        <CardTitle className="text-xl space-x-2 tracking-wide">
          <span>Simulation</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex h-[90%] py-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} className="h-full">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={false}>
              <Label value="Time" position="insideBottomRight" />
            </XAxis>
            <YAxis>
              <Label value="Protein Levels" angle={-90} offset={5} position="insideLeft" />
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {proteinNames.map((name, index) => (
              <Line
                key={name}
                type="monotone"
                dataKey={name}
                stroke={`hsl(var(--chart-${(index % 5) + 1}))`}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
