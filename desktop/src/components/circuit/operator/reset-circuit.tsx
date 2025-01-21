import { useEditorContext } from "@/components/editor/editor-context";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { useReactFlow } from "@xyflow/react";
import { RotateCw } from "lucide-react";

export const ResetCircuit = () => {
  const { setNodes, setEdges } = useReactFlow();
  const { setEditorContent } = useEditorContext();

  const handleClick = (e) => {
    e.stopPropagation();
    setNodes([]);
    setEdges([]);
    setEditorContent("");
  };

  return (
    <TooltipProvider>
      <div className="flex bg-gray-100 rounded-lg shadow-lg border border-gray-300 p-0" data-testid="reset-circuit">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="p-0 w-8 h-8 hover:bg-black/5"
              onClick={handleClick}
              aria-label="reset circuit"
              data-testid="reset-circuit-button"
            >
              <RotateCw className="w-5 h-5 text-gray-500" />
            </Button>
          </TooltipTrigger>
          {/* Using RadixTooltip.Portal to avoid layout issues caused by parent styles */}
          <RadixTooltip.Portal>
            <TooltipContent>
              <p>Reset circuit</p>
            </TooltipContent>
          </RadixTooltip.Portal>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
