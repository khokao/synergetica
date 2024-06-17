import type React from "react";
import { createContext, useContext, useState } from "react";

import type { GeneratorError, GeneratorResponseData } from "@electron/interfaces/generatorAPI";

type GeneratorResponseContextType = {
  response: GeneratorResponseData | GeneratorError | null;
  setResponse: React.Dispatch<React.SetStateAction<GeneratorResponseData | GeneratorError | null>>;
};

const GeneratorResponseContext = createContext<GeneratorResponseContextType | undefined>(undefined);

export const ResponseProvider: React.FC = ({ children }) => {
  const [response, setResponse] = useState<GeneratorResponseData | GeneratorError | null>(null);
  return (
    <GeneratorResponseContext.Provider value={{ response, setResponse }}>{children}</GeneratorResponseContext.Provider>
  );
};

export const useResponse = () => {
  const context = useContext(GeneratorResponseContext);
  if (!context) {
    throw new Error("useResponse must be used within a ResponseProvider");
  }
  return context;
};
