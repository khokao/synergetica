import { DEFAULT_SLIDER_PARAM, WS_URL } from "@/components/simulation/constants";
import { useReactFlow } from "@xyflow/react";
import { produce } from "immer";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface SimulatorSolution {
  time: number;
  [proteinName: string]: number;
}

interface SimulatorContextValue {
  solutions: SimulatorSolution[];
  proteinName2Ids: Record<string, string[]>;
  setProteinName2Ids: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  proteinParameters: Record<string, number>;
  setProteinParameters: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  formulate: () => void;
  reset: () => void;
}

const SimulatorContext = createContext<SimulatorContextValue | null>(null);

export const SimulatorProvider = ({ children }: { children: React.ReactNode }) => {
  const reactFlow = useReactFlow();
  const [ws, setWs] = useState<WebSocket | null>(null);

  const [solutions, setSolutions] = useState<SimulatorSolution[]>([]);
  const [proteinName2Ids, setProteinName2Ids] = useState<Record<string, string[]>>({});
  const [proteinParameters, setProteinParameters] = useState<Record<string, number>>({});

  useEffect(() => {
    const socket = new WebSocket(WS_URL);

    socket.onopen = () => console.log("[WebSocket] connected");
    socket.onerror = (err) => console.error("[WebSocket] error:", err);
    socket.onclose = () => console.log("[WebSocket] disconnected");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "formulated": {
          const newName2Ids: Record<string, string[]> = data.payload.protein_name2ids;
          setProteinName2Ids(newName2Ids);

          const initParams: Record<string, number> = {};
          for (const id of Object.values(newName2Ids).flat()) {
            initParams[id] = DEFAULT_SLIDER_PARAM;
          }
          setProteinParameters(initParams);

          highlightNodes(Object.keys(initParams));
          break;
        }

        case "simulated": {
          setSolutions(data.payload.solutions);
          break;
        }

        default:
          console.warn("[WebSocket] unknown message type:", data.type);
      }
    };

    setWs(socket);
    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    ws.send(
      JSON.stringify({
        type: "simulate",
        payload: { params: proteinParameters },
      }),
    );
  }, [ws, proteinParameters]);

  const formulate = () => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    ws.send(
      JSON.stringify({
        type: "formulate",
        payload: {
          rfobject: reactFlow.toObject(),
        },
      }),
    );
  };

  const reset = () => {
    setSolutions([]);

    const { getNodes, setNodes } = reactFlow;
    setNodes(
      produce(getNodes(), (draft) => {
        for (const node of draft) {
          node.data.simulationTargetHighlight = undefined;
        }
      }),
    );
  };

  const highlightNodes = (nodeIds: string[]) => {
    const { getNodes, setNodes } = reactFlow;

    setNodes(
      produce(getNodes(), (draft) => {
        for (const node of draft) {
          const idx = nodeIds.indexOf(node.id);
          if (idx === -1) {
            node.data.simulationTargetHighlight = undefined;
          } else {
            const colorIndex = idx % 5;
            node.data.simulationTargetHighlight = `hsl(var(--chart-${colorIndex + 1}))`;
          }
        }
      }),
    );
  };

  const contextValue: SimulatorContextValue = {
    solutions,
    proteinName2Ids,
    setProteinName2Ids,
    proteinParameters,
    setProteinParameters,
    formulate,
    reset,
  };

  return <SimulatorContext.Provider value={contextValue}>{children}</SimulatorContext.Provider>;
};

export const useSimulator = (): SimulatorContextValue => {
  const context = useContext(SimulatorContext);
  if (!context) {
    throw new Error("useSimulator must be used within a SimulatorProvider");
  }
  return context;
};
