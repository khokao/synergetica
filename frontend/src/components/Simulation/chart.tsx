import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface LineChartComponentProps {
  chartData: any[];
  proteinNames: string[];
}

export const Chart: React.FC<LineChartComponentProps> = ({ chartData, proteinNames }) => {
  return (
    <Card className="flex flex-col flex-grow overflow-hidden">
      <CardContent className="flex flex-grow h-full overflow-auto">
        <LineChart width={500} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" label={{ value: "Time", position: "insideBottomRight", offset: -5 }} />
          <YAxis label={{ value: "Protein Levels", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          {proteinNames.map((name, index) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              stroke={`hsl(${(index * 60) % 360}, 70%, 50%)`}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </CardContent>
    </Card>
  );
};
