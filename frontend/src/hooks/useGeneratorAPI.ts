import type { GeneratorResponseData, GeneratorRequestData } from "@/interfaces/generatorAPI";
import { invoke } from "@tauri-apps/api/tauri";

// This function is responsible for making the API call to the backend via Tauri.
// It only focuses on API communication and does not include any state management or UI logic.
export const callGeneratorAPI = async (data: GeneratorRequestData) => {
  return await invoke<GeneratorResponseData>("call_generator_api", {
    reactflowObjectJsonStr: data.reactflow_object_json_str,
    rbsTargetParameters: data.rbs_target_parameters,
  });
};

export const cancelGeneratorAPI = async () => {
  await invoke("cancel_generator_api");
};
