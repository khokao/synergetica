import type { PanelPosition } from "@/components/hooks/use-panel-controls";
import type React from "react";
import { createContext, useContext } from "react";

type PanelContextType = {
  openPanels: Record<PanelPosition, boolean>;
  togglePanel: (position: PanelPosition) => void;
};

const PanelContext = createContext<PanelContextType | undefined>(undefined);

export const usePanelContext = () => {
  const context = useContext(PanelContext);
  if (!context) {
    throw new Error("usePanelContext must be used within a PanelProvider");
  }
  return context;
};

export const PanelProvider: React.FC<{ children: React.ReactNode; value: PanelContextType }> = ({
  children,
  value,
}) => <PanelContext.Provider value={value}>{children}</PanelContext.Provider>;
