import { invoke } from "@tauri-apps/api/core";

export interface GeneratorRequestData {
  proteinTargetValues: Record<string, number>;
}

// names are not renamed to camelCase ?
export interface GeneratorResponseData {
  protein_generated_sequences: Record<string, string>;
}

// This function is responsible for making the API call to the backend via Tauri.
// It only focuses on API communication and does not include any state management or UI logic.
export const callGeneratorAPI = async (data: GeneratorRequestData) => {
  return await invoke<GeneratorResponseData>("call_generator_api", {
    proteinTargetValues: data.proteinTargetValues,
  });
};

export const cancelGeneratorAPI = async () => {
  await invoke("cancel_generator_api");
};
