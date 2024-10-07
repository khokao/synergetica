import React, { createContext, useContext } from 'react';
import { useConverterAPI, useSimulatorResult, ConverterRequestData, ConverterResponseData } from '@/components/simulation/hooks/use-simulator-api';

interface SimulatorContextProps {
  postConverter: (flowDataJson: ConverterRequestData) => Promise<ConverterResponseData>;
  convertResult: ConverterResponseData | null;
  resetSimulator: () => void;
  simulatorResult: { [key: string]: number };
  setSimulatorResult: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
}

const SimulatorContext = createContext<SimulatorContextProps | undefined>(undefined);

export const SimulatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { postConverter, convertResult, resetSimulator } = useConverterAPI();
  const { simulatorResult, setSimulatorResult } = useSimulatorResult();

  return (
    <SimulatorContext.Provider value={{ postConverter, convertResult, resetSimulator, simulatorResult, setSimulatorResult }}>
      {children}
    </SimulatorContext.Provider>
  );
};

export const useSimulator = (): SimulatorContextProps => {
  const context = useContext(SimulatorContext);
  if (!context) {
    throw new Error('useSimulator must be used within a SimulatorProvider');
  }
  return context;
};
