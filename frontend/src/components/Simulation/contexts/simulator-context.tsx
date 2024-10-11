import React, { createContext, useContext, useState } from 'react';

interface SimulatorContextProps {
  simulationResult: number[][] | null;
  setSimulationResult: React.Dispatch<React.SetStateAction<number[][] | null>>;
}

const SimulatorContext = createContext<SimulatorContextProps | undefined>(undefined);

export const SimulatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [simulationResult, setSimulationResult] = useState<number[][] | null>(null);

  return (
    <SimulatorContext.Provider value={{ simulationResult, setSimulationResult }}>
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
