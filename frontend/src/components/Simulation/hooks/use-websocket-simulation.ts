// hooks/use-websocket-simulation.ts
import { useEffect, useRef } from 'react';
import { useConverter } from '@/components/simulation/contexts/converter-context';
import { useSimulator } from '@/components/simulation/contexts/simulator-context';

export const useWebSocketSimulation = (proteinParameter: number[]) => {
  const { convertResult } = useConverter();
  const { setSimulationData } = useSimulator();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (convertResult !== null && proteinParameter.length > 0) {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        sendParameters(wsRef.current, proteinParameter);
        return;
      }

      const ws = new WebSocket("ws://127.0.0.1:8000/ws/simulation");

      ws.onopen = () => {
        ws.send(JSON.stringify(convertResult));
        sendParameters(ws, proteinParameter);
      };

      ws.onmessage = (event) => {
        try {
          const receivedData = JSON.parse(event.data) as number[][];
          setSimulationData(receivedData);
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
  }, [convertResult, proteinParameter, setSimulationData]);

  useEffect(() => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      sendParameters(ws, proteinParameter);
    }
  }, [proteinParameter]);

  const sendParameters = (ws: WebSocket, parameters: number[]) => {
    const params = JSON.stringify({ params: parameters });
    ws.send(params);
  };
};
