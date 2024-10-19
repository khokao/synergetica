import { useConverter } from "@/components/simulation/contexts/converter-context";
import { useEffect, useState } from "react";

export const useProteinParameters = () => {
  const { convertResult } = useConverter();
  const [proteinParameter, setProteinParameter] = useState<{ [id: string]: number }>({});

  useEffect(() => {
    if (convertResult !== null) {
      const initParams: { [id: string]: number } = {};
      Object.keys(convertResult.protein_id2name).forEach((id) => {
        initParams[id] = 1;
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

  return {
    proteinParameter,
    handleProteinParamChange,
  };
};
