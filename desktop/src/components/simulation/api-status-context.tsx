import { invoke } from "@tauri-apps/api/core";
import { createContext, useContext, useEffect, useState } from "react";

interface ApiStatusContextValue {
  isHealthcheckOk: boolean;
}

const ApiStatusContext = createContext<ApiStatusContextValue | null>(null);

export const ApiStatusProvider = ({ children }: { children: React.ReactNode }) => {
  const [isHealthcheckOk, setHealthcheckOk] = useState(false);

  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;

    const doHealthCheck = async () => {
      try {
        const result = await invoke<string>("call_healthcheck");
        if (result === "ok") {
          setHealthcheckOk(true);
        }
      } catch (err) {
        setHealthcheckOk(false);
        console.error("Healthcheck failed", err);
      }
    };

    doHealthCheck(); // Initial check
    timerId = setInterval(doHealthCheck, 5000); // 5 seconds interval

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, []);

  return (
    <ApiStatusContext.Provider
      value={{
        isHealthcheckOk,
      }}
    >
      {children}
    </ApiStatusContext.Provider>
  );
};

export const useApiStatus = () => {
  const context = useContext(ApiStatusContext);
  if (!context) {
    throw new Error("useApiStatus must be used within a ApiStatusProvider");
  }
  return context;
};
