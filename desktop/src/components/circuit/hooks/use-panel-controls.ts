import { useRef, useState } from "react";

export type PanelPosition = "left" | "right";

interface PanelRef {
  resize: (size: number) => void;
}

export const usePanelControls = () => {
  const [openPanels, setOpenPanels] = useState({
    left: false,
    right: false,
  });

  const panelRefs: Record<PanelPosition, React.RefObject<PanelRef | null>> = {
    left: useRef<PanelRef>(null),
    right: useRef<PanelRef>(null),
  };

  const togglePanel = (position: PanelPosition) => {
    const panelRef = panelRefs[position];
    const isOpen = openPanels[position];

    if (panelRef.current) {
      if (isOpen) {
        panelRef.current.resize(0);
      } else {
        panelRef.current.resize(25.0);
      }
      setOpenPanels((prev) => ({
        ...prev,
        [position]: !isOpen,
      }));
    }
  };

  return {
    openPanels,
    panelRefs,
    togglePanel,
  };
};
