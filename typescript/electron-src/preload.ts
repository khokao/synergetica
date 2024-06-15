import { contextBridge, ipcRenderer } from "electron";
import type { IpcRendererEvent } from "electron/main";
import type { GeneratorError, GeneratorResponseData, generatorRequestData } from "./interfaces/generatorAPI";

// We are using the context bridge to securely expose NodeAPIs.
// Please note that many Node APIs grant access to local system resources.
// Be very cautious about which globals and APIs you expose to untrusted remote content.
contextBridge.exposeInMainWorld("electron", {
  callGeneratorAPI: (data: generatorRequestData) => ipcRenderer.send("call-generator-api", data),
  onGeneratorAPIResponse: (handler: (event: IpcRendererEvent, data: GeneratorResponseData | GeneratorError) => void) =>
    ipcRenderer.on("call-generator-api-response", handler),
  removeGeneratorAPIResponse: (
    handler: (event: IpcRendererEvent, data: GeneratorResponseData | GeneratorError) => void,
  ) => ipcRenderer.removeListener("call-generator-api-response", handler),
});
