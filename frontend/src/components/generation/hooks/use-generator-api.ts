import { invoke } from "@tauri-apps/api/tauri";

export interface GeneratorRequestData {
  reactflowObjectJsonStr: string;
  rbsTargetParameters: { [key: string]: number };
}

interface ChildNodesDetails {
  nodeCategory: string;
  sequence: string;
}

// names are not renamed to camelCase ?
export interface GeneratorResponseData {
  parent2child_details: { [key: string]: ChildNodesDetails[] };
}

export interface GeneratorError {
  error: string;
}

// This function is responsible for making the API call to the backend via Tauri.
// It only focuses on API communication and does not include any state management or UI logic.
export const callGeneratorAPI = async (data: GeneratorRequestData) => {
  return await invoke<GeneratorResponseData>("call_generator_api", {
    reactflowObjectJsonStr: data.reactflowObjectJsonStr,
    rbsTargetParameters: data.rbsTargetParameters,
  });
};

export const cancelGeneratorAPI = async () => {
  await invoke("cancel_generator_api");
};
