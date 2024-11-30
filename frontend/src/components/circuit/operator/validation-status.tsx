import { usePanelContext } from "@/components/circuit/resizable-panel/resizable-panel-context";
import { useEditorContext } from "@/components/editor/editor-context";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { AlertCircle, CircleCheck } from "lucide-react";
import type { FC } from "react";

export const ValidationStatus: FC = () => {
  const { validationError } = useEditorContext();
  const { openPanels, togglePanel } = usePanelContext();

  const noError = !validationError || validationError.length === 0;
  const isOpen = openPanels.left;

  const Icon = noError ? CircleCheck : AlertCircle;
  const iconClass = noError ? "h-5 w-5 !text-green-600" : "h-5 w-5 !text-red-600";

  const handleClick = (e) => {
    e.stopPropagation();
    if (!isOpen) {
      togglePanel("left");
    }
  };

  return (
    <TooltipProvider>
      <div className="flex bg-gray-100 rounded-lg shadow-lg border border-gray-300 p-0" data-testid="validation-status">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="p-0 w-8 h-8 hover:bg-black/5"
              onClick={handleClick}
              aria-label="validation status"
              data-testid="validation-status-button"
            >
              <Icon className={iconClass} />
            </Button>
          </TooltipTrigger>
          {/* Using RadixTooltip.Portal to avoid layout issues caused by parent styles */}
          <RadixTooltip.Portal>
            <TooltipContent>
              <p>Validation status</p>
            </TooltipContent>
          </RadixTooltip.Portal>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
