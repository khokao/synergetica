import type { GeneratorResponseContextType } from "@/interfaces/generatorAPI";
import type { GeneratorError, GeneratorResponseData, generatorRequestData } from "@/interfaces/generatorAPI";
import { invoke } from "@tauri-apps/api/tauri";
import type React from "react";
import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

const GeneratorResponseContext = createContext<GeneratorResponseContextType | undefined>(undefined);

export const ResponseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [response, setResponse] = useState<GeneratorResponseData | GeneratorError | null>(null);

  const callGeneratorAPI = async (data: generatorRequestData) => {
    try {
      const response = await invoke<GeneratorResponseData>("call_generator_api", {
        rbsParameter: data.rbs_parameter,
        rbsUpstream: data.rbs_upstream,
        rbsDownstream: data.rbs_downstream,
        promoterParameter: data.promoter_parameter,
        promoterUpstream: data.promoter_upstream,
      });
      setResponse(response);
    } catch (error) {
      setResponse({ error: (error as Error).message });
    }
  };

  return (
    <GeneratorResponseContext.Provider value={{ response, setResponse, callGeneratorAPI }}>
      {children}
    </GeneratorResponseContext.Provider>
  );
};

export const useResponse = () => {
  const context = useContext(GeneratorResponseContext);
  if (!context) {
    throw new Error("useResponse must be used within a ResponseProvider");
  }
  return context;
};
