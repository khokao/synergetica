import type {
  SimulatorRequestData,
  SimulatorResponseData,
  ConverterRequestData,
  ConverterResponseData,
} from "@/interfaces/simulatorAPI";
import { invoke } from "@tauri-apps/api/tauri";
import { useState } from "react";

export const callSimulatorAPI = async (data: SimulatorRequestData) => {
  return await invoke<SimulatorResponseData>("call_simulator_api", {
    param1: data.param1,
    param2: data.param2,
  });
};

export const callCircuitConverterAPI = async (data: ConverterRequestData) => {
  return await invoke<ConverterResponseData>("call_circuit_converter_api", {
    flowJson: data.flow_json,
  });
};

export const useConverterAPI = () => {
  const [ConvertResult, setConvertResult] = useState<ConverterResponseData | null>(null);
  const postConverter = async (flowDataJson: ConverterRequestData) => {
    const response = await callCircuitConverterAPI(flowDataJson);
    setConvertResult(response);
    return response;
  };
  const resetSimulator = async () => {
    setConvertResult(null);
  };
  return { postConverter, ConvertResult, resetSimulator };
};
