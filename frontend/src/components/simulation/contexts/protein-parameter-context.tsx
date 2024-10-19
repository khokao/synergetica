import { DEFAULT_SLIDER_PARAM } from "@/components/simulation/constants";
import { useConverter } from "@/components/simulation/contexts/converter-context";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface ProteinParameterContextProps {
  proteinParameter: { [id: string]: number };
  setProteinParameter: React.Dispatch<React.SetStateAction<{ [id: string]: number }>>;
  handleProteinParamChange: (id: string) => (value: number[]) => void;
}

const ProteinParameterContext = createContext<ProteinParameterContextProps | undefined>(undefined);

export const ProteinParameterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { convertResult } = useConverter();
  const [proteinParameter, setProteinParameter] = useState<{ [id: string]: number }>({});

  useEffect(() => {
    if (convertResult !== null) {
      const initParams: { [id: string]: number } = {};
      Object.keys(convertResult.protein_id2name).forEach((id) => {
        initParams[id] = DEFAULT_SLIDER_PARAM;
      });
      setProteinParameter(initParams);
    }
  }, [convertResult]);

  const handleProteinParamChange = (id: string) => (value: number[]) => {
    setProteinParameter((prevParams) => ({
      ...prevParams,
      [id]: value[0],
    }));
  };

  return (
    <ProteinParameterContext.Provider value={{ proteinParameter, setProteinParameter, handleProteinParamChange }}>
      {children}
    </ProteinParameterContext.Provider>
  );
};

export const useProteinParameters = (): ProteinParameterContextProps => {
  const context = useContext(ProteinParameterContext);
  if (!context) {
    throw new Error("useProteinParameters must be used within a ProteinParameterProvider");
  }
  return context;
};
