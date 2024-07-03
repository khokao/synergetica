import type { SimulatorRequestData, SimulatorResponseData } from "@/interfaces/simulatorAPI";
import { invoke } from "@tauri-apps/api/tauri";

export const callSimulatorAPI = async (data: SimulatorRequestData) => {
  return await invoke<SimulatorResponseData>("call_simulator_api", {
    param1: data.param1,
    param2: data.param2,
  });
};
