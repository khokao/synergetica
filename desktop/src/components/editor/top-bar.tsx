import { useEditorContext } from "@/components/editor/editor-context";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { ArrowDownToLine, ArrowUpToLine, Clipboard } from "lucide-react";
import { toast } from "sonner";

export const EditorTopBar = () => {
  const { editorContent, setEditorContent, setEditMode } = useEditorContext();

  const handleCopy = async () => {
    try {
      await writeText(editorContent);
      toast.success("Copied to clipboard", {
        cancel: { label: "Close", onClick: () => {} },
      });
    } catch (error) {
      toast.error("Failed to copy to clipboard", {
        cancel: { label: "Close", onClick: () => {} },
      });
      console.error("Clipboard copy failed:", error);
    }
  };

  const handleImport = async () => {
    try {
      const path = await open({
        multiple: false,
        directory: false,
        filters: [
          {
            name: "YAML",
            extensions: ["yaml", "yml"],
          },
        ],
      });

      if (path) {
        const content = await readTextFile(path);
        setEditMode("monaco-editor");
        setEditorContent(content);
        toast.success("Imported circuit YAML file", {
          cancel: { label: "Close", onClick: () => {} },
        });
      }
    } catch (error) {
      toast.error("Failed to import circuit YAML file", {
        cancel: { label: "Close", onClick: () => {} },
      });
      console.error("File import failed:", error);
    }
  };

  const handleExport = async () => {
    try {
      const path = await save({
        filters: [{ name: "YAML", extensions: ["yaml", "yml"] }],
        defaultPath: "circuit.yaml",
      });

      if (path) {
        await writeTextFile(path, editorContent);
        toast.success("Exported circuit YAML file", {
          cancel: { label: "Close", onClick: () => {} },
        });
      }
    } catch (error) {
      toast.error("Failed to export circuit YAML file", {
        cancel: { label: "Close", onClick: () => {} },
      });
      console.error("File export failed:", error);
    }
  };

  return (
    <div className="flex justify-between items-center p-1">
      <span className="pl-2 text-md font-medium">Circuit YAML</span>
      <TooltipProvider>
        <div className="flex space-x-1 z-10">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleCopy} data-testid="editor-copy-button" className="p-1">
                <Clipboard className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            {/* Using RadixTooltip.Portal to avoid layout issues caused by parent styles */}
            <RadixTooltip.Portal>
              <TooltipContent>
                <p>Copy to clipboard</p>
              </TooltipContent>
            </RadixTooltip.Portal>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleImport}
                data-testid="editor-import-button"
                className="p-1"
              >
                <ArrowDownToLine className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <RadixTooltip.Portal>
              <TooltipContent>
                <p>Import DSL</p>
              </TooltipContent>
            </RadixTooltip.Portal>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleExport}
                data-testid="editor-export-button"
                className="p-1"
              >
                <ArrowUpToLine className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <RadixTooltip.Portal>
              <TooltipContent>
                <p>Export DSL</p>
              </TooltipContent>
            </RadixTooltip.Portal>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};
