"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { openUrl } from "@tauri-apps/plugin-opener";
import { BookMarked, Github } from "lucide-react";
import Image from "next/image";

export const Header = () => {
  const handleOpenUrl = async (url: string) => {
    try {
      await openUrl(url);
    } catch (err) {
      console.error("Failed to open URL:", err);
    }
  };

  return (
    <header className="flex items-center justify-between px-6 h-16 bg-gray-100 shrink-0">
      <div className="flex items-center">
        <Image src="/images/banner.svg" width={200} height={48} alt="Banner" />
      </div>

      <TooltipProvider>
        <div className="flex items-center space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 hover:bg-neutral-200 [&_svg]:size-6"
                onClick={() => handleOpenUrl("https://khokao.github.io/synergetica/")}
                data-testid="document-button"
              >
                <BookMarked />
              </Button>
            </TooltipTrigger>

            {/* Using RadixTooltip.Portal to avoid layout issues caused by parent styles */}
            <RadixTooltip.Portal>
              <TooltipContent side="bottom">
                <p>Document</p>
              </TooltipContent>
            </RadixTooltip.Portal>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 hover:bg-neutral-200 [&_svg]:size-6"
                onClick={() => handleOpenUrl("https://github.com/khokao/synergetica")}
                data-testid="github-button"
              >
                <Github />
              </Button>
            </TooltipTrigger>

            {/* Using RadixTooltip.Portal to avoid layout issues caused by parent styles */}
            <RadixTooltip.Portal>
              <TooltipContent side="bottom">
                <p>GitHub</p>
              </TooltipContent>
            </RadixTooltip.Portal>
          </Tooltip>
        </div>
      </TooltipProvider>
    </header>
  );
};
