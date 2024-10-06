import { usePanelContext } from "@/components/circuit/panel/panel-context";
import type { PanelPosition } from "@/components/hooks/use-panel-controls";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from "lucide-react";
import type React from "react";

type ExpandCollapseButtonProps = {
  position: PanelPosition;
};

export const ExpandCollapseButton: React.FC<ExpandCollapseButtonProps> = ({ position }) => {
  const { openPanels, togglePanel } = usePanelContext();

  const isOpen = openPanels[position];

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
    <Button onClick={() => togglePanel(position)} variant="ghost" size="icon" className="p-2">
      {isOpen ? icons[position].close : icons[position].open}
    </Button>
  );
};
