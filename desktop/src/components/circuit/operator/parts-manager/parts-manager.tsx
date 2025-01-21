import { PartAddManager } from "@/components/circuit/operator/parts-manager/part-add-manager";
import { PartDeleteManager } from "@/components/circuit/operator/parts-manager/part-delete-manager";
import { PartEditManager } from "@/components/circuit/operator/parts-manager/part-edit-manager";
import { PartsImportExportManager } from "@/components/circuit/operator/parts-manager/parts-import-export-manager";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Database } from "lucide-react";

export const PartsManager = () => {
  return (
    <TooltipProvider>
      <div
        className="flex flex-col bg-gray-100 text-gray-500 rounded-lg shadow-lg border border-gray-300"
        data-testid="parts-manager"
      >
        <div className="flex items-center space-x-2 p-0.5">
          <Button variant="ghost" size="icon" className="p-0 w-7 h-7 cursor-default">
            <Database className="w-5 h-5 text-gray-500" />
          </Button>
          <span className="cursor-default whitespace-nowrap">Parts Database</span>
        </div>

        <Separator orientation="horizontal" />

        <div className="flex items-center space-x-2 p-0.5">
          <PartAddManager />
          <PartDeleteManager />
          <PartEditManager />
          <Separator orientation="vertical" className="h-6" />
          <PartsImportExportManager />
        </div>
      </div>
    </TooltipProvider>
  );
};
