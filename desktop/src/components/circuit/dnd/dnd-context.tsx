import type React from "react";
import { createContext, useContext, useMemo, useState } from "react";

type DnDCategory = "Promoter" | "Protein" | "Terminator" | null;

interface DnDContextValue {
  dndCategory: DnDCategory;
  setDnDCategory: React.Dispatch<React.SetStateAction<DnDCategory>>;
}

const DnDContext = createContext<DnDContextValue | undefined>(undefined);

interface DnDProviderProps {
  children: React.ReactNode;
}

export const DnDProvider: React.FC<DnDProviderProps> = ({ children }) => {
  const [dndCategory, setDnDCategory] = useState<DnDCategory>(null);

  const value = useMemo(() => ({ dndCategory, setDnDCategory }), [dndCategory]);

  return <DnDContext.Provider value={value}>{children}</DnDContext.Provider>;
};

export const useDnD = (): DnDContextValue => {
  const context = useContext(DnDContext);
  if (!context) {
    throw new Error("useDnD must be used within a DnDProvider");
  }
  return context;
};
