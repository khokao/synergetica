import axios from "axios";
import { type IpcMainEvent, ipcMain } from "electron";
import type { generatorRequestData } from "./interfaces/generatorAPI";

export class IPCHandler {
  constructor() {
    this.initialize();
  }

  private initialize() {
    ipcMain.on("call-generator-api", async (event: IpcMainEvent, data: generatorRequestData) => {
      try {
        const response = await axios.post("http://127.0.0.1:8000/generate", data);
        event.sender.send("call-generator-api-response", response.data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.toString() : "Unknown error";
        event.sender.send("call-generator-api-response", {
          error: errorMessage,
        });
      }
    });
  }
}
