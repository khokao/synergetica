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
