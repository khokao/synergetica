import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";


export interface ConverterRequestData {
  flow_json: string;
}

export interface ConverterResponseData {
  num_protein: number;
  proteins: { [key: string]: string };
  function_str: string;
}


export const callCircuitConverterAPI = async (data: ConverterRequestData) => {
  return await invoke<ConverterResponseData>("call_circuit_converter_api", {
    flowJson: data.flow_json,
  });
};

export const useConverterAPI = () => {
  const [convertResult, setConvertResult] = useState<ConverterResponseData | null>(null);
  const postConverter = async (flowDataJson: ConverterRequestData) => {
    const response = await callCircuitConverterAPI(flowDataJson);
    setConvertResult(response);
    return response; /* may not need this line*/
  };
  const resetSimulator = async () => {
    setConvertResult(null);
  };
  return { postConverter, convertResult, resetSimulator };
};

export const useSimulatorResult = () => {
  const [simulatorResult, setSimulatorResult] = useState<{ [key: string]: number }>({});
  return { simulatorResult, setSimulatorResult };
};
