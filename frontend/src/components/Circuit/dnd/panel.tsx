import { useDnD } from "@/components/circuit/dnd/context";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CornerUpRight, RectangleHorizontal, Type } from "lucide-react";
import type React from "react";

const IconTooltip: React.FC<{
  label: string;
  icon: React.ReactNode;
  color: string;
  nodeCategory: string;
  onDragStart: (nodeCategory: string) => void;
}> = ({ label, icon, color, nodeCategory, onDragStart }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div
        className={`flex items-center justify-center cursor-pointer w-10 h-10 rounded-lg ${color}`}
        onDragStart={() => onDragStart(nodeCategory)}
        draggable
      >
        {icon}
      </div>
    </TooltipTrigger>
    <TooltipContent side="bottom" align="center">
      {label}
    </TooltipContent>
  </Tooltip>
);

export const DnDPanel: React.FC = () => {
  const [_, setDnDCategory] = useDnD();

  const handleDragStart = (nodeCategory: string) => {
    setDnDCategory(nodeCategory);
  };

  return (
    <TooltipProvider>
      <div className="flex justify-center space-x-4 bg-gray-100 shadow-lg p-2 rounded-lg">
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
