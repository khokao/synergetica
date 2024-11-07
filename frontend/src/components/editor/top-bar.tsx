import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { Clipboard, Download, Upload } from "lucide-react";

export const EditorTopBar = () => {
  const handleCopy = () => {};
  const handleImport = () => {};
  const handleExport = () => {};

  return (
    <div className="flex justify-between items-center p-1">
      <span className="pl-2 text-md font-medium">Config YAML</span>
      <div className="flex space-x-1">
        <Button variant="ghost" size="icon" onClick={handleCopy} data-testid="editor-copy-button" className="p-1">
          <Clipboard className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleImport} data-testid="editor-import-button" className="p-1">
          <Upload className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleExport} data-testid="editor-export-button" className="p-1">
          <Download className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
