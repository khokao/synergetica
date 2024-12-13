import { invoke } from "@tauri-apps/api/core";

export interface ConverterRequestData {
  reactflowObjectJsonStr: string;
}

export interface ConverterResponseData {
  protein_id2name: { [key: string]: string };
  function_str: string;
  valid: boolean;
}

export const callCircuitConverterAPI = async (data: ConverterRequestData) => {
  return await invoke<ConverterResponseData>("call_circuit_converter_api", {
    reactflowObjectJsonStr: data.reactflowObjectJsonStr,
  });
};
