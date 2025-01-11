import { DEFAULT_SLIDER_PARAM, WS_URL } from "@/components/simulation/constants";
import { invoke } from "@tauri-apps/api/core";
import { useReactFlow } from "@xyflow/react";
import type { Node } from "@xyflow/react";
import { useNodes } from "@xyflow/react";
import { deepEqual } from "fast-equals";
import { produce } from "immer";
import type React from "react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

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
  const [ws, setWs] = useState<WebSocket | null>(null);

  const [solutions, setSolutions] = useState<SimulatorSolution[]>([]);
  const [proteinName2Ids, setProteinName2Ids] = useState<Record<string, string[]>>({});
  const [proteinParameters, setProteinParameters] = useState<Record<string, number>>({});

  const [hasFormulated, setHasFormulated] = useState<boolean>(false);

  const reactflow = useReactFlow();
  const nodes = useNodes();
  const [debouncedNodes] = useDebounce(nodes, 500);
  const [prevNodes, setPrevNodes] = useState<Node[]>([]);

  useEffect(() => {
    if (ws) return;

    const tryConnect = async () => {
      try {
        const result = await invoke<string>("call_healthcheck");
        if (result === "ok") {
          const socket = new WebSocket(WS_URL);

          socket.onopen = () => {
            console.log("[WebSocket] connected");
          };

          socket.onerror = (err) => {
            console.error("[WebSocket] error:", err);
          };

          socket.onclose = () => {
            console.log("[WebSocket] disconnected");
            setWs(null);
          };

          socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            switch (data.type) {
              case "formulated": {
                setHasFormulated(true);
                setProteinName2Ids(data.payload.protein_name2ids);

                const initParams = Object.fromEntries(
                  Object.values(data.payload.protein_name2ids)
                    .flat()
                    .map((id: string) => [id, DEFAULT_SLIDER_PARAM]),
                );
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
          clearInterval(intervalId);
        } else {
          console.error("[Healthcheck] Server not ready. result:", result);
        }
      } catch (error) {
        console.error("[Healthcheck] Failed to connect to server:", error);
      }
    };

    const intervalId = setInterval(tryConnect, 5000); // 5 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, [ws]);

  useEffect(() => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    if (!hasFormulated) return;

    ws.send(
      JSON.stringify({
        type: "simulate",
        payload: { params: proteinParameters },
      }),
    );
  }, [ws, proteinParameters, hasFormulated]);

  const formulate = () => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    setHasFormulated(false);

    ws.send(
      JSON.stringify({
        type: "formulate",
        payload: {
          rfobject: reactflow.toObject(),
        },
      }),
    );
  };

  const reset = useCallback(() => {
    setHasFormulated(false);
    setSolutions([]);
    unhighlightNodes();
  }, []);

  const highlightNodes = (nodeIds: string[]) => {
    const { getNodes, setNodes } = reactflow;
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
  const unhighlightNodes = () => {
    const { getNodes, setNodes } = reactflow;
    setNodes(
      produce(getNodes(), (draft) => {
        for (const node of draft) {
          node.data.simulationTargetHighlight = undefined;
        }
      }),
    );
  };

  const getMonitoredNodeProps = useCallback((nodes: Node[]) => {
    return nodes.map((node) => {
      const { type, data } = node;
      const { name, category, sequence, controlBy, params } = data || {};
      return {
        type,
        data: {
          name,
          category,
          sequence,
          controlBy,
          params,
        },
      };
    });
  }, []);

  useEffect(() => {
    if (debouncedNodes.length === 0) return;

    const filteredCurrent = getMonitoredNodeProps(debouncedNodes);
    const filteredPrev = getMonitoredNodeProps(prevNodes);

    if (!deepEqual(filteredCurrent, filteredPrev)) {
      if (solutions.length > 0) {
        reset();
      }
      setPrevNodes(debouncedNodes);
    }
  }, [debouncedNodes, prevNodes, getMonitoredNodeProps, reset, solutions]);

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
