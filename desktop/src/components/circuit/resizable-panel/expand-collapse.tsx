import { usePanelContext } from "@/components/circuit/resizable-panel/resizable-panel-context";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from "lucide-react";

export const ExpandCollapseButton = ({ position }) => {
  const { panelOpenState, togglePanel } = usePanelContext();
  const isOpen = panelOpenState[position];

  const icons = {
    left: {
      open: <PanelLeftOpen className="w-5 h-5" />,
      close: <PanelLeftClose className="w-5 h-5" />,
    },
    right: {
      open: <PanelRightOpen className="w-5 h-5" />,
      close: <PanelRightClose className="w-5 h-5" />,
    },
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Button
              variant="ghost"
              size="icon"
              className="p-2"
              onClick={() => togglePanel(position)}
              data-testid="expand-collapse-button"
            >
              {isOpen ? icons[position].close : icons[position].open}
            </Button>
          </div>
        </TooltipTrigger>

        {/* Using RadixTooltip.Portal to avoid layout issues caused by parent styles */}
        <RadixTooltip.Portal>
          <TooltipContent side={position === "left" ? "right" : "left"}>
            <p>{isOpen ? "Close" : "Open"}</p>
          </TooltipContent>
        </RadixTooltip.Portal>
      </Tooltip>
    </TooltipProvider>
  );
};
