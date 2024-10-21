import { WS_URL } from "@/components/simulation/constants";
import { useConverter } from "@/components/simulation/contexts/converter-context";
import { useSimulator } from "@/components/simulation/contexts/simulator-context";
import { useEffect, useRef } from "react";

export const useWebSocketSimulation = (proteinParameter: { [id: string]: number }) => {
  const { convertResult } = useConverter();
  const { setSimulationResult } = useSimulator();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (convertResult !== null && Object.keys(proteinParameter).length > 0) {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        sendParameters(wsRef.current, proteinParameter);
        return;
      }

      const ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        ws.send(JSON.stringify(convertResult));
        sendParameters(ws, proteinParameter);
      };

      ws.onmessage = (event) => {
        try {
          const receivedData = JSON.parse(event.data) as number[][];
          setSimulationResult(receivedData);
        } catch (error) {
          console.log("Received non-JSON data:", event.data);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = () => {
        wsRef.current = null;
      };

      wsRef.current = ws;

      return () => {
        if (wsRef.current) {
          wsRef.current.close();
          wsRef.current = null;
        }
      };
    }
  }, [convertResult, proteinParameter, setSimulationResult]);

  useEffect(() => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      sendParameters(ws, proteinParameter);
    }
  }, [proteinParameter]);

  const sendParameters = (ws: WebSocket, parameters: { [id: string]: number }) => {
    const params = JSON.stringify({ params: parameters });
    ws.send(params);
  };
};
