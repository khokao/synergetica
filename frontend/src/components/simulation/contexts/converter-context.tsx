import type { ConverterResponseData } from "@/components/simulation/hooks/use-simulator-api";
import type React from "react";
import { createContext, useContext, useState } from "react";

interface ConverterContextProps {
  convertResult: ConverterResponseData | null;
  setConvertResult: React.Dispatch<React.SetStateAction<ConverterResponseData | null>>;
}

const ConverterContext = createContext<ConverterContextProps | undefined>(undefined);

export const ConverterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [convertResult, setConvertResult] = useState<ConverterResponseData | null>(null);

  return <ConverterContext.Provider value={{ convertResult, setConvertResult }}>{children}</ConverterContext.Provider>;
};

export const useConverter = (): ConverterContextProps => {
  const context = useContext(ConverterContext);
  if (!context) {
    throw new Error("useConverter must be used within a ConverterProvider");
  }
  return context;
};
