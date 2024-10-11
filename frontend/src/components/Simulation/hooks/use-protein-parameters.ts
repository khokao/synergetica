import { useState, useEffect } from 'react';
import { useConverter } from "@/components/simulation/contexts/converter-context";

export const useProteinParameters = () => {
  const { convertResult } = useConverter();
  const [proteinParameter, setProteinParameter] = useState<number[]>([]);

  useEffect(() => {
    if (convertResult !== null) {
      const numProteins = Object.keys(convertResult.protein_id2name).length;
      const initParameter = Array(numProteins).fill(1);
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
