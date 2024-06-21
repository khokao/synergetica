import type { GeneratorResponseData, generatorRequestData } from "@/interfaces/generatorAPI";
import { invoke } from "@tauri-apps/api/tauri";

export const fetcher = async (key: string) => {
  return await invoke(key);
};

export const callGeneratorAPI = async (data: generatorRequestData) => {
  return await invoke<GeneratorResponseData>("call_generator_api", {
    rbsParameter: data.rbs_parameter,
    rbsUpstream: data.rbs_upstream,
    rbsDownstream: data.rbs_downstream,
    promoterParameter: data.promoter_parameter,
    promoterUpstream: data.promoter_upstream,
  });
};
