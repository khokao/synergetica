import { usePanelContext } from "@/components/circuit/resizable-panel/resizable-panel-context";
import { useEditorContext } from "@/components/editor/editor-context";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { AlertCircle, CircleCheck } from "lucide-react";

export const ValidationStatus = () => {
  const { validationError } = useEditorContext();
  const { openPanel } = usePanelContext();

  const isValid = !validationError || validationError.length === 0;

  const { Icon, iconClassName, tooltipContent } = isValid
    ? { Icon: CircleCheck, iconClassName: "h-5 w-5 text-green-600", tooltipContent: "Circuit is valid" }
    : { Icon: AlertCircle, iconClassName: "h-5 w-5 text-red-600", tooltipContent: "Circuit has errors" };

  const handleClick = (e) => {
    e.stopPropagation();
    openPanel("left");
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
              <Icon className={iconClassName} />
            </Button>
          </TooltipTrigger>
          {/* Using RadixTooltip.Portal to avoid layout issues caused by parent styles */}
          <RadixTooltip.Portal>
            <TooltipContent>{tooltipContent}</TooltipContent>
          </RadixTooltip.Portal>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
