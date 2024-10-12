import React, { useState } from 'react';
import { useDnD } from "@/components/circuit/dnd/dnd-context";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { CornerUpRight, RectangleHorizontal, Type } from "lucide-react";

const IconTooltip = ({ label, icon, color, nodeCategory, onDragStart }) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const handleDragStart = () => {
    // Tooltip is hidden when dragging starts to prevent it from persisting during drag events
    setTooltipVisible(false);
    onDragStart(nodeCategory);
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

  const handleDragStart = (nodeCategory) => {
    if (!setDnDCategory) return;
    setDnDCategory(nodeCategory);
  };

  return (
    <TooltipProvider>
      <div className="flex items-center justify-center w-[140px] h-[48px] mr-[32px] space-x-3 bg-gray-100 shadow-lg px-3 py-2 rounded-lg">
        <IconTooltip
          label="Promoter"
          icon={<CornerUpRight className="text-blue-800" />}
          color="bg-blue-200"
          nodeCategory="promoter"
          onDragStart={handleDragStart}
        />
        <IconTooltip
          label="Protein"
          icon={<RectangleHorizontal className="text-green-800" />}
          color="bg-green-200"
          nodeCategory="protein"
          onDragStart={handleDragStart}
        />
        <IconTooltip
          label="Terminator"
          icon={<Type className="text-red-800" />}
          color="bg-red-200"
          nodeCategory="terminator"
          onDragStart={handleDragStart}
        />
      </div>
    </TooltipProvider>
  );
};
