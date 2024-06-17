import { app } from "electron";
import prepareNext from "electron-next";
import { IPCHandler } from "./ipcHandler";
import { MainWindow } from "./mainWindow";

app.on("ready", async () => {
  await prepareNext("./renderer");

  const mainWindow = new MainWindow();
  await mainWindow.createWindow();

  new IPCHandler();
});

app.on("window-all-closed", app.quit);
