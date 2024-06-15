declare module "electron-next" {
  interface Directories {
    production: string;
    development: string;
  }

  // biome-ignore lint/style/noDefaultExport: default export is required.
  export default function (directories: Directories | string, port?: number): Promise<void>;
}
