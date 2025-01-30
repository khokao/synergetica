import { createContext, useContext, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";

type PanelPosition = "left" | "right";

interface PanelRef {
  resize: (size: number) => void;
}

interface PanelContextType {
  panelOpenState: Record<PanelPosition, boolean>;
  panelRefs: Record<PanelPosition, RefObject<PanelRef | null>>;
  openPanel: (position: PanelPosition) => void;
  closePanel: (position: PanelPosition) => void;
  togglePanel: (position: PanelPosition) => void;
}

const PanelContext = createContext<PanelContextType | undefined>(undefined);

export function usePanelContext(): PanelContextType {
  const context = useContext(PanelContext);
  if (!context) {
    throw new Error("usePanelContext must be used within a PanelProvider");
  }
  return context;
}

export const PanelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [panelOpenState, setPanelOpenState] = useState<Record<PanelPosition, boolean>>({
    left: false,
    right: false,
  });

  const panelRefs: Record<PanelPosition, RefObject<PanelRef | null>> = {
    left: useRef<PanelRef>(null),
    right: useRef<PanelRef>(null),
  };

  const openPanel = (position: PanelPosition) => {
    panelRefs[position].current?.resize(25.0);
    setPanelOpenState((prev) => ({
      ...prev,
      [position]: true,
    }));
  };

  const closePanel = (position: PanelPosition) => {
    panelRefs[position].current?.resize(0);
    setPanelOpenState((prev) => ({
      ...prev,
      [position]: false,
    }));
  };

  const togglePanel = (position: PanelPosition) => {
    if (panelOpenState[position]) {
      closePanel(position);
    } else {
      openPanel(position);
    }
  };

  const contextValue: PanelContextType = {
    panelOpenState,
    panelRefs,
    openPanel,
    closePanel,
    togglePanel,
  };

  return <PanelContext.Provider value={contextValue}>{children}</PanelContext.Provider>;
};
