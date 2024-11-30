import { initChildNodeData } from "@/components/circuit/hooks/utils/create-node";
import { useParts } from "@/components/circuit/parts/parts-context";
import { partsCollectionSchema } from "@/components/circuit/parts/schema";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { useReactFlow } from "@xyflow/react";
import { produce } from "immer";
import { ArrowDownToLine, ArrowUpToLine } from "lucide-react";
import type { FC } from "react";
import { toast } from "sonner";

export const PartsImportExportManager: FC = () => {
  const { parts, setParts } = useParts();
  const { getNodes, setNodes } = useReactFlow();

  const handleImport = async () => {
    try {
      const path = await open({
        multiple: false,
        directory: false,
        filters: [
          {
            name: "JSON",
            extensions: ["json"],
          },
        ],
      });

      if (path) {
        const content = await readTextFile(path);
        const newParts = partsCollectionSchema.parse(JSON.parse(content));
        setParts(newParts);

        const nodes = getNodes();
        const newNodes = produce(nodes, (draft) => {
          for (const node of draft) {
            if (node.type === "child") {
              if (typeof node.data.name === "string" && node.data.name in newParts) {
                const attributes = newParts[node.data.name];
                node.data.name = attributes.name;
                node.data.description = attributes.description;
                node.data.category = attributes.category;
                node.data.sequence = attributes.sequence;
                node.data.controlBy = attributes.controlBy;
                node.data.controlTo = attributes.controlTo;
                node.data.meta = attributes.meta;
              } else {
                node.data = { ...initChildNodeData, category: node.data.category };
              }
            }
          }
        });
        setNodes(newNodes);

        toast.success("Imported config YAML file", {
          cancel: { label: "Close", onClick: () => {} },
        });
      }
    } catch (error) {
      toast.error("Failed to import config YAML file", {
        cancel: { label: "Close", onClick: () => {} },
      });
      console.error("File import failed:", error);
    }
  };

  const handleExport = async () => {
    try {
      const path = await save({
        filters: [{ name: "JSON", extensions: ["json"] }],
        defaultPath: "parts.json",
      });

      if (path) {
        await writeTextFile(path, JSON.stringify(parts, null, 2));
        toast.success("Exported parts JSON file", {
          cancel: { label: "Close", onClick: () => {} },
        });
      }
    } catch (error) {
      toast.error("Failed to export parts JSON file", {
        cancel: { label: "Close", onClick: () => {} },
      });
      console.error("File export failed:", error);
    }
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleImport}
            data-testid="parts-import-button"
            className="p-0.5 w-7 h-7 hover:bg-black/5"
          >
            <ArrowDownToLine className="w-5 h-5" />
          </Button>
        </TooltipTrigger>
        <RadixTooltip.Portal>
          <TooltipContent>
            <p>Import all parts config</p>
          </TooltipContent>
        </RadixTooltip.Portal>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleExport}
            data-testid="parts-export-button"
            className="p-0.5 w-7 h-7 hover:bg-black/5"
          >
            <ArrowUpToLine className="w-5 h-5" />
          </Button>
        </TooltipTrigger>
        <RadixTooltip.Portal>
          <TooltipContent>
            <p>Export all parts config</p>
          </TooltipContent>
        </RadixTooltip.Portal>
      </Tooltip>
    </>
  );
};
