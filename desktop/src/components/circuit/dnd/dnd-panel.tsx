import { useDnD } from "@/components/circuit/dnd/dnd-context";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { RiText } from "@remixicon/react";
import { CornerUpRight, RectangleHorizontal } from "lucide-react";
import React, { useState } from "react";

const IconTooltip = ({ label, icon, color, category, onDragStart }) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const handleDragStart = () => {
    // Tooltip is hidden when dragging starts to prevent it from persisting during drag events
    setTooltipVisible(false);
    onDragStart(category);
  };

  return (
    <Tooltip open={tooltipVisible}>
      <TooltipTrigger asChild>
        <div
          className={`flex items-center justify-center cursor-pointer w-8 h-8 rounded-lg ${color}`}
          draggable
          onDragStart={handleDragStart}
          onPointerEnter={() => setTooltipVisible(true)}
          onPointerLeave={() => setTooltipVisible(false)}
          data-testid={`icon-${category}`}
        >
          {icon}
        </div>
      </TooltipTrigger>
      <RadixTooltip.Portal>
        <TooltipContent side="bottom">
          <p>{label}</p>
        </TooltipContent>
      </RadixTooltip.Portal>
    </Tooltip>
  );
};

export const DnDPanel = () => {
  const [_, setDnDCategory] = useDnD();

  const handleDragStart = (category) => {
    if (!setDnDCategory) return;
    setDnDCategory(category);
  };

  return (
    <TooltipProvider>
      <div className="flex items-center justify-center w-[140px] h-[48px] mr-[32px] space-x-3 bg-gray-100 shadow-lg px-3 py-2 rounded-lg">
        <IconTooltip
          label="Promoter"
          icon={<CornerUpRight className="text-promoter-800" />}
          color="bg-promoter-200"
          category="Promoter"
          onDragStart={handleDragStart}
        />
        <IconTooltip
          label="Protein"
          icon={<RectangleHorizontal className="text-protein-800" />}
          color="bg-protein-200"
          category="Protein"
          onDragStart={handleDragStart}
        />
        <IconTooltip
          label="Terminator"
          icon={<RiText className="text-terminator-800" />}
          color="bg-terminator-200"
          category="Terminator"
          onDragStart={handleDragStart}
        />
      </div>
    </TooltipProvider>
  );
};
