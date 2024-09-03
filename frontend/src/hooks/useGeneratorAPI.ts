import type { GeneratorResponseData, generatorRequestData } from "@/interfaces/generatorAPI";
import { invoke } from "@tauri-apps/api/tauri";

export const callGeneratorAPI = async (data: generatorRequestData) => {
  return await invoke<GeneratorResponseData>("call_generator_api", {
    reactflowObjectJsonStr: data.reactflow_object_json_str,
    rbsTargetParameters: data.rbs_target_parameters,
  });
};

export const cancelGeneratorAPI = async () => {
  await invoke("cancel_generator_api");
};
