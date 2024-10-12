import React, { createContext, useContext, useState, useEffect } from 'react';
import { useConverter } from "@/components/simulation/contexts/converter-context";

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
      Object.keys(convertResult.protein_id2name).forEach(id => {
        initParams[id] = 1;
      });
      setProteinParameter(initParams);
    }
  }, [convertResult]);

  const handleProteinParamChange = (id: string) => (value: number[]) => {
    setProteinParameter(prevParams => ({
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
    throw new Error('useProteinParameters must be used within a ProteinParameterProvider');
  }
  return context;
};
