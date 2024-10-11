import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from "recharts";
import { useSimulator } from "@/components/simulation/contexts/simulator-context";
import { useConverter } from "@/components/simulation/contexts/converter-context";

interface CustomTooltipProps {
  active?: boolean;
  payload?: { color: string; name: string; value: number }[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-300 p-2 rounded shadow-lg">
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
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
      dataPoint[name] = row[index + 1];
    });
    return dataPoint;
  });

  return (
    <Card className="border-0 h-full border-0 shadow-none pt-2">
      <CardHeader className="items-center p-2 h-[5vh]">
        <CardTitle className="text-xl">Simulation Result</CardTitle>
      </CardHeader>
      <CardContent className="flex h-[40vh] py-2">
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
                stroke={`hsl(var(--chart-${(index) % 5 + 1}))`}
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
