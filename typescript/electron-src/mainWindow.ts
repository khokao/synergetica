import { join } from "node:path";
import { BrowserWindow } from "electron";
import isDev from "electron-is-dev";

export class MainWindow {
  private mainWindow: BrowserWindow | null = null;

  async createWindow() {
    this.mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: join(__dirname, "preload.js"),
      },
    });

    const url = this.generateURL();
    this.mainWindow.loadURL(url);
  }

  private generateURL(): string {
    if (isDev) {
      return "http://localhost:8000/";
    }
    const filePath = join(__dirname, "../renderer/out/index.html");
    return new URL(`file://${filePath}`).toString();
  }
}
