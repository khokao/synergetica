// hooks/use-protein-parameters.ts
import { useState, useEffect } from 'react';
import { ConverterResponseData } from '@/components/simulation/hooks/use-simulator-api';

export const useProteinParameters = (convertResult: ConverterResponseData | null) => {
  const [proteinParameter, setProteinParameter] = useState<number[]>([]);

  useEffect(() => {
    if (convertResult !== null) {
      const initParameter = Array(convertResult.num_protein).fill(1);
      setProteinParameter(initParameter);
    }
  }, [convertResult]);

  const handleProteinParamChange = (index: number) => (value: number[]) => {
    setProteinParameter((prevParams) => {
      const newProteinParams = [...prevParams];
      newProteinParams[index] = value[0];
      return newProteinParams;
    });
  };

  return {
    proteinParameter,
    handleProteinParamChange,
  };
};
