import { useRef, useState } from "react";

export type PanelPosition = "left" | "right";

export const usePanelControls = () => {
  const [openPanels, setOpenPanels] = useState({
    left: false,
    right: false,
  });

  const panelRefs = {
    left: useRef<any>(null),
    right: useRef<any>(null),
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
