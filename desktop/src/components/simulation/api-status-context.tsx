import { invoke } from "@tauri-apps/api/core";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

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
          // Show success toast if it's the first time
          if (!isHealthcheckOk) {
            toast.success("Connected to server");
          }
          setHealthcheckOk(true);
        }
      } catch (err) {
        if (isHealthcheckOk) {
          toast.error("Disconnected from server");
        }
        setHealthcheckOk(false);
        console.error("Healthcheck failed", err);
      }
    };

    doHealthCheck(); // Initial check
    timerId = setInterval(doHealthCheck, 5000); // 5 seconds interval

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isHealthcheckOk]);

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
