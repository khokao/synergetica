import { useApiStatus } from "@/components/simulation/api-status-context";
import { DEFAULT_SLIDER_PARAM } from "@/components/simulation/constants";
import { SimulatorProvider, useSimulator } from "@/components/simulation/simulator-context";
import { act, renderHook } from "@testing-library/react";
import { ReactFlowProvider } from "@xyflow/react";
import * as xyflow from "@xyflow/react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("@xyflow/react", async () => {
  const actual = await vi.importActual<typeof import("@xyflow/react")>("@xyflow/react");

  const mockUseNodes = vi.fn(() => {
    return actual.useNodes();
  });

  return {
    ...actual,
    useNodes: mockUseNodes,
  };
});

vi.mock("@/components/simulation/api-status-context", () => ({
  useApiStatus: vi.fn().mockReturnValue({ isHealthcheckOk: true }),
}));

const MockWebSocket = vi.fn().mockImplementation(function (this) {
  this.onopen = null;
  this.onmessage = null;
  this.onerror = null;
  this.onclose = null;
  this.send = vi.fn();
  this.close = vi.fn();
});

describe("SimulatorContext", () => {
  beforeAll(() => {
    vi.stubGlobal("WebSocket", MockWebSocket);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    // @ts-ignore
    console.log.mockRestore();
    // @ts-ignore
    console.error.mockRestore();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ReactFlowProvider>
      <SimulatorProvider>{children}</SimulatorProvider>
    </ReactFlowProvider>
  );

  it("does not open WebSocket if isHealthcheckOk is false", async () => {
    // Arrange
    vi.mocked(useApiStatus).mockReturnValueOnce({ isHealthcheckOk: false });

    // Act
    renderHook(() => useSimulator(), { wrapper });

    // Assert
    expect(MockWebSocket).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith("[Healthcheck] Server not ready.");
  });

  it("tries to reconnect on WebSocket onclose", async () => {
    // Arrange
    renderHook(() => useSimulator(), { wrapper });
    const wsInstance = MockWebSocket.mock.instances[0];

    act(() => {
      wsInstance.onopen?.(new Event("open"));
    });
    expect(wsInstance).toBeDefined();
    expect(console.log).toHaveBeenCalledWith("[WebSocket] connected");

    // Act
    act(() => {
      wsInstance.onclose?.(new CloseEvent("close"));
    });

    // Assert
    expect(console.log).toHaveBeenCalledWith("[WebSocket] disconnected");
    vi.advanceTimersByTime(5001);
    expect(MockWebSocket.mock.instances.length).toBeGreaterThan(1);
  });

  it("provides default state when initialized with no external data", () => {
    // Arrange & Act
    const { result } = renderHook(() => useSimulator(), { wrapper });

    // Assert
    expect(result.current.solutions).toEqual([]);
    expect(Object.keys(result.current.proteinName2Ids)).toHaveLength(0);
    expect(Object.keys(result.current.proteinParameters)).toHaveLength(0);
  });

  it("clears solutions array when reset is called", () => {
    // Arrange
    const { result } = renderHook(() => useSimulator(), { wrapper });

    act(() => {
      result.current.solutions.push({ time: 0, proteinX: 123 });
    });
    expect(result.current.solutions).toHaveLength(1);

    // Act
    act(() => {
      result.current.reset();
    });

    // Assert
    expect(result.current.solutions).toEqual([]);
  });

  it("calls WebSocket send when formulate() is invoked", async () => {
    // Arrange
    const { result } = renderHook(() => useSimulator(), { wrapper });
    const wsInstance = MockWebSocket.mock.instances[0];

    act(() => {
      wsInstance.onopen?.(new Event("open"));
    });

    // Act
    await act(async () => {
      result.current.formulate();
    });

    // Assert
    expect(wsInstance.send).toHaveBeenCalledTimes(1);
    expect(JSON.parse(wsInstance.send.mock.calls[0][0]).type).toBe("formulate");
  });

  it("updates state when receiving 'formulated' message from server", async () => {
    // Arrange
    const { result } = renderHook(() => useSimulator(), { wrapper });
    const wsInstance = MockWebSocket.mock.instances[0];

    act(() => {
      wsInstance.onopen?.(new Event("open"));
    });

    const messageData = {
      type: "formulated",
      payload: {
        protein_name2ids: {
          ProteinA: ["child-1", "child-2"],
          ProteinB: ["child-3"],
        },
      },
    };

    // Act
    await act(async () => {
      wsInstance.onmessage?.({ data: JSON.stringify(messageData) } as MessageEvent);
    });

    // Assert
    expect(result.current.proteinName2Ids).toEqual({
      ProteinA: ["child-1", "child-2"],
      ProteinB: ["child-3"],
    });
    expect(result.current.proteinParameters).toEqual({
      "child-1": DEFAULT_SLIDER_PARAM,
      "child-2": DEFAULT_SLIDER_PARAM,
      "child-3": DEFAULT_SLIDER_PARAM,
    });
  });

  it("updates state when receiving 'simulated' message from server", async () => {
    // Arrange
    const { result } = renderHook(() => useSimulator(), { wrapper });
    const wsInstance = MockWebSocket.mock.instances[0];

    act(() => {
      wsInstance.onopen?.(new Event("open"));
    });

    const messageData = {
      type: "simulated",
      payload: {
        solutions: [
          { time: 0, proteinA: 123 },
          { time: 1, proteinA: 456 },
        ],
      },
    };

    // Act
    await act(async () => {
      wsInstance.onmessage?.({ data: JSON.stringify(messageData) } as MessageEvent);
    });

    // Assert
    expect(result.current.solutions).toEqual([
      { time: 0, proteinA: 123 },
      { time: 1, proteinA: 456 },
    ]);
  });

  it("calls reset() automatically when monitored node props change and solutions is not empty", () => {
    // Arrange
    vi.useFakeTimers();

    const prevNodes = [
      {
        id: "child-1",
        type: "child",
        position: { x: 0, y: 0 },
        data: {
          name: "ProteinA",
          category: "Protein",
          sequence: "ATCG",
          controlBy: [],
          params: {},
        },
      },
    ];
    const nextNodes = [
      {
        id: "child-1",
        type: "child",
        position: { x: 0, y: 0 },
        data: {
          name: "ProteinB", // name changed
          category: "Protein",
          sequence: "ATCG",
          controlBy: [],
          params: {},
        },
      },
    ];

    vi.mocked(xyflow.useNodes).mockReturnValue(prevNodes);

    const { result, rerender } = renderHook(() => useSimulator(), { wrapper });

    act(() => {
      result.current.solutions.push({ time: 0, proteinA: 123 });
    });
    expect(result.current.solutions).toHaveLength(1);

    // Act
    act(() => {
      vi.mocked(xyflow.useNodes).mockReturnValue(nextNodes);
      rerender();
    });

    act(() => {
      vi.advanceTimersByTime(501);
    });

    // Assert
    expect(result.current.solutions).toHaveLength(0);
  });
});
