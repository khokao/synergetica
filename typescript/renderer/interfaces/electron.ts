import type { GeneratorError, GeneratorResponseData, generatorRequestData } from "@electron/interfaces/generatorAPI";
import type { IpcRendererEvent } from "electron";

declare global {
  interface ElectronAPI {
    callGeneratorAPI: (data: generatorRequestData) => void;
    onGeneratorAPIResponse: (handler: (event: IpcRendererEvent, data: GeneratorResponseData) => void) => void;
    removeGeneratorAPIResponse: (
      handler: (event: IpcRendererEvent, data: GeneratorResponseData | GeneratorError) => void,
    ) => void;
  }

  interface Window {
    electron: ElectronAPI;
  }
}
