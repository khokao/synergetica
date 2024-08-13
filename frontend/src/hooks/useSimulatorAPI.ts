import type { SimulatorRequestData, SimulatorResponseData,ConverterRequestData,ConverterResponseData } from "@/interfaces/simulatorAPI";
import { invoke } from "@tauri-apps/api/tauri";

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
