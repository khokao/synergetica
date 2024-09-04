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
import { init } from "next/dist/compiled/webpack/webpack";
import type React from "react";
import { useEffect, useState,Dispatch,SetStateAction} from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const getGraphOptions = () => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: "Simulation Result",
    },
  },
  scales: {
    x: {
      display: false,
    },
    y: {
      title: {
        display: true,
        text: "Protein Levels",
      },
    },
  },
});

const ParamInput = ({ label, value, onChange }) => (
  <label className="flex items-center mb-2">
    <span className="inline-block w-16">{label}</span>
    <input type="range" min="1" max="1000" step="1" value={value} onChange={onChange} className="mx-2" />
    <span className="w-12 text-right">{value}</span>
  </label>
);

const setSimulatorOutput = (ws: WebSocket, newProteinParams: number[], setSimOutput: Dispatch<SetStateAction<number[][] | null>>) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    const params = JSON.stringify({
      params: newProteinParams,
    });
    
    ws.send(params);
    ws.onmessage = (event) => {
      let receivedData;
      try {
        receivedData = JSON.parse(event.data);
        setSimOutput(receivedData);
      } catch (error) {
        console.log("Received non-JSON data:", event.data);
        return;
      }
    };
  }
}

export const Graph: React.FC<{ ConvertResult: ConverterResponseData | null, proteinParameter: number[],setproteinParameter:Dispatch<SetStateAction<number[]>>}> = ({ ConvertResult,proteinParameter,setproteinParameter }) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [simOutput, setSimOutput] = useState<number[][] | null>(Array[0]);

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
    newProteinParams[index] = Number.parseFloat(event.target.value);
    setproteinParameter(newProteinParams);
    
    const simulation_result: { [key: string]: number } = {};
    ConvertResult?.proteins.forEach((protein_name, i) => {
      simulation_result[protein_name] = newProteinParams[i];
    });
    setSimulatorOutput(ws, newProteinParams, setSimOutput);
  };

  const options = getGraphOptions();

  const graphData = simOutput && ConvertResult
    ? {
        labels: simOutput.map(([time]) => time),
        datasets: Array(ConvertResult?.num_protein)
          .fill(0)
          .map((_, i) => ({
            label: ConvertResult.proteins[i],
            data: simOutput.map((row) => row[1 + i]),
            borderColor: `hsl(${(i * 60) % 360}, 70%, 50%)`,
            fill: false,
          })),
      }
    : null;

  return (
    <div className="h-full">
      {ConvertResult ? (
        <div className="flex flex-row h-full">
          <div className="h-full w-2/3">{graphData && <Line options={options} data={graphData} />}</div>
          <div className="flex flex-col justify-center items-center ml-5 mb-4 w-1/3">
            {proteinParameter.map((param, index) => (
              <ParamInput
                key={ConvertResult.proteins[index]}
                label={ConvertResult.proteins[index]}
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
