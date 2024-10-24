import type React from "react";
import { type ReactNode, createContext, useContext, useState } from "react";

type DnDContextType = [string | null, React.Dispatch<React.SetStateAction<string | null>>];

export const DnDContext = createContext<DnDContextType>([null, () => {}]);

interface DnDProviderProps {
  children: ReactNode;
}

export const DnDProvider: React.FC<DnDProviderProps> = ({ children }) => {
  const [dndCategory, setDnDCategory] = useState<string | null>(null);

  return <DnDContext.Provider value={[dndCategory, setDnDCategory]}>{children}</DnDContext.Provider>;
};

export const useDnD = (): DnDContextType => {
  return useContext(DnDContext);
};
