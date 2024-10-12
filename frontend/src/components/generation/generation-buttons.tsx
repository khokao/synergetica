import { Play, Ban, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GenerationResultModal } from '@/components/generation/generation-result-modal';
import { useGeneratorData } from '@/components/generation/hooks/use-generator-data';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as RadixTooltip from '@radix-ui/react-tooltip';

export const GenerationButtons = () => {
  const { data, snapshot, isMutating, generate, cancel } = useGeneratorData();

  return (
    <div className="flex justify-center items-center space-x-4">
      <TooltipProvider>

        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button size="icon" onClick={generate} disabled={isMutating}>
                {isMutating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Play className="w-5 h-5" />
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
              <Button size="icon" disabled={!isMutating} onClick={cancel}>
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

        <GenerationResultModal data={data} snapshot={snapshot} />
      </TooltipProvider>
    </div>
  );
};
