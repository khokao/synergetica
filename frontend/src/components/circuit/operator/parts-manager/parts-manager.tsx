import { PartAddManager } from "@/components/circuit/operator/parts-manager/part-add-manager";
import { PartDeleteManager } from "@/components/circuit/operator/parts-manager/part-delete-manager";
import { PartEditManager } from "@/components/circuit/operator/parts-manager/part-edit-manager";
import { PartsImportExportManager } from "@/components/circuit/operator/parts-manager/parts-import-export-manager";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Database } from "lucide-react";
import type { FC } from "react";

export const PartsManager: FC = () => {
  return (
    <TooltipProvider>
      <div
        className="flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg shadow-lg border border-gray-300 space-x-2 p-0.5"
        data-testid="parts-manager"
      >
        <Button variant="ghost" size="icon" className="p-0.5 w-7 h-7 cursor-default">
          <Database className="w-5 h-5 text-gray-500" />
        </Button>

        <span className="cursor-default">Parts</span>

        <Separator orientation="vertical" className="h-6" />

        <PartAddManager />

        <PartDeleteManager />

        <PartEditManager />

        <Separator orientation="vertical" className="h-6" />

        <PartsImportExportManager />
      </div>
    </TooltipProvider>
  );
};
