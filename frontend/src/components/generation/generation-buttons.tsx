import { GenerationResultModal } from "@/components/generation/generation-result-modal";
import { useGeneratorData } from "@/components/generation/hooks/use-generator-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { Ban, Loader2, Play } from "lucide-react";

export const GenerationButtons = () => {
  const { data, snapshot, isMutating, generate, cancel } = useGeneratorData();

  return (
    <Card className="border-0 shadow-none h-full flex-col justify-center items-center py-2">
      <CardHeader className="flex justify-center items-center h-1/3">
        <CardTitle className="text-xl space-x-2 tracking-wide">
          <span>Generation</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center space-x-4 h-2/3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button size="icon" onClick={generate} disabled={isMutating} data-testid="run-button">
                  {isMutating ? (
                    <Loader2 className="w-5 h-5 animate-spin" data-testid="loader-icon" />
                  ) : (
                    <Play className="w-5 h-5" data-testid="play-icon" />
                  )}
                </Button>
              </div>
            </TooltipTrigger>

            {/* Using RadixTooltip.Portal to avoid layout issues caused by parent styles */}
            <RadixTooltip.Portal>
              <TooltipContent>
                <p>Run</p>
              </TooltipContent>
            </RadixTooltip.Portal>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button size="icon" disabled={!isMutating} onClick={cancel} data-testid="cancel-button">
                  <Ban className="w-5 h-5" />
                </Button>
              </div>
            </TooltipTrigger>

            <RadixTooltip.Portal>
              <TooltipContent>
                <p>Cancel</p>
              </TooltipContent>
            </RadixTooltip.Portal>
          </Tooltip>

          <GenerationResultModal data={data} snapshot={snapshot} data-testid="generation-result-modal" />
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};
