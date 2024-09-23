import { getGraphOptions } from "@/components/Simulation/GraphSetting";
import { ParamInput } from "@/components/Simulation/ParamBar";
import { paramMinValue,paramMaxValue } from "@/components/Simulation/ParamBar";
import type { ConverterResponseData } from "@/interfaces/simulatorAPI";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import type React from "react";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const setSimulatorOutput = (
  ws: WebSocket,
  newProteinParams: number[],
  setSimOutput: Dispatch<SetStateAction<number[][] | null>>,
) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    const params = JSON.stringify({
      params: newProteinParams,
    });

    ws.send(params);
    ws.onmessage = (event) => {
      let receivedData: number[][];
      try {
        receivedData = JSON.parse(event.data);
        setSimOutput(receivedData);
      } catch (error) {
        console.log("Received non-JSON data:", event.data);
        return;
      }
    };
  }
};

type GraphProps = {
  ConvertResult: ConverterResponseData | null;
  setSimulatorResult: Dispatch<SetStateAction<{ [key: string]: number }>>;
};

export const Graph: React.FC<GraphProps> = ({ ConvertResult, setSimulatorResult }) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [simOutput, setSimOutput] = useState<number[][] | null>(Array[0]);
  const [proteinParameter, setproteinParameter] = useState<number[]>([]);

  useEffect(() => {
    if (ConvertResult !== null) {
      const initParameter = Array(ConvertResult.num_protein).fill(1);
      setproteinParameter(initParameter);

      const wsDefine = new WebSocket("ws://127.0.0.1:8000/ws/simulation");
      wsDefine.onopen = () => {
        wsDefine.send(JSON.stringify(ConvertResult));
        setSimulatorOutput(wsDefine, initParameter, setSimOutput);
      };

      wsDefine.onmessage = (event) => {
        console.log("Received from server:", event.data);
      };

      wsDefine.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      setWs(wsDefine);

      return () => {
        wsDefine.close();
      };
    }
  }, [ConvertResult]);

  const handleProteinParamChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newProteinParams = [...proteinParameter];
    let value = Number.parseFloat(event.target.value);

    if (value > paramMaxValue) {
      value = paramMaxValue;
    } else if (value < paramMinValue) {
      value = paramMinValue;
    }

    newProteinParams[index] = value;
    setproteinParameter(newProteinParams);

    const simulation_result: { [key: string]: number } = {};
    const proteinIds = ConvertResult ? Object.keys(ConvertResult.proteins) : [];

    setSimulatorOutput(ws, newProteinParams, setSimOutput);

    proteinIds.forEach((proteinId, i) => {
      simulation_result[proteinId] = newProteinParams[i];
    });

    setSimulatorResult(simulation_result);
  };

  const options = getGraphOptions();

  const graphData =
    simOutput && ConvertResult
      ? {
          labels: simOutput.map(([time]) => time),
          datasets: Array(ConvertResult?.num_protein)
            .fill(0)
            .map((_, i) => ({
              label: Object.values(ConvertResult.proteins)[i],
              data: simOutput.map((row) => row[1 + i]),
              borderColor: `hsl(${(i * 60) % 360}, 70%, 50%)`,
              fill: false,
            })),
        }
      : null;

  return (
    <div className="h-full w-full">
      {ConvertResult ? (
        <div className="flex flex-col h-3/5 m-8">
          <div className="h-full">{graphData && <Line options={options} data={graphData} />}</div>
          <div className="flex flex-col justify-center items-center ml-5 mb-4 w-1/3">
            {proteinParameter.map((param, index) => (
              <ParamInput
                key={Object.values(ConvertResult.proteins)[index]}
                label={Object.values(ConvertResult.proteins)[index]}
                value={param}
                onChange={handleProteinParamChange(index)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-full text-center">
          <span>Build Circuit to Simulate</span>
          <span>
            and press
            <button type="button" className="px-2 py-1 mx-2 border-2 border-black rounded">
              Simulate
            </button>
            button
          </span>
        </div>
      )}
    </div>
  );
};
