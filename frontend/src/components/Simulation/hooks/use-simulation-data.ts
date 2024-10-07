import { useState, useEffect } from "react";
import { useSimulator } from "@/components/simulation/simulator-context";

export const useSimulationData = () => {
  const { convertResult, setSimulatorResult } = useSimulator();

  const [ws, setWs] = useState<WebSocket | null>(null);
  const [simOutput, setSimOutput] = useState<number[][] | null>(null);
  const [proteinParameter, setProteinParameter] = useState<number[]>([]);

  useEffect(() => {
    if (convertResult !== null) {
      const initParameter = Array(convertResult.num_protein).fill(1);
      setProteinParameter(initParameter);

      const wsDefine = new WebSocket("ws://127.0.0.1:8000/ws/simulation");
      wsDefine.onopen = () => {
        wsDefine.send(JSON.stringify(convertResult));
        setSimulatorOutput(wsDefine, initParameter);
      };

      wsDefine.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      setWs(wsDefine);

      return () => {
        wsDefine.close();
      };
    }
  }, [convertResult]);

  const setSimulatorOutput = (
    ws: WebSocket,
    newProteinParams: number[],
  ) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const params = JSON.stringify({
        params: newProteinParams,
      });

      ws.send(params);
      ws.onmessage = (event) => {
        try {
          const receivedData = JSON.parse(event.data) as number[][];
          setSimOutput(receivedData);
        } catch (error) {
          console.log("Received non-JSON data:", event.data);
        }
      };
    }
  };

  const handleProteinParamChange = (index: number) => (value: number[]) => {
    const newProteinParams = [...proteinParameter];
    newProteinParams[index] = value[0];
    setProteinParameter(newProteinParams);

    if (ws) {
      setSimulatorOutput(ws, newProteinParams);
    } else {
      console.error("WebSocket is not connected.");
    }

    if (convertResult) {
      const simulationResult: { [key: string]: number } = {};
      const proteinIds = Object.keys(convertResult.proteins);

      proteinIds.forEach((proteinId, i) => {
        simulationResult[proteinId] = newProteinParams[i];
      });

      setSimulatorResult(simulationResult);
    }
  };

  const proteinNames = convertResult ? Object.values(convertResult.proteins) : [];

  const chartData =
    simOutput && convertResult
      ? simOutput.map((row) => {
          const dataPoint: { [key: string]: number } = { time: row[0] };
          proteinNames.forEach((name, index) => {
            dataPoint[name] = row[index + 1];
          });
          return dataPoint;
        })
      : [];

  return {
    proteinParameter,
    handleProteinParamChange,
    proteinNames,
    chartData,
    convertResult,
  };
};
