import { WS_URL } from "@/components/simulation/constants";
import { useWebSocketSimulation } from "@/components/simulation/hooks/use-websocket-simulation";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockConvertResult = {
  protein_id2name: { foo: "Protein A", bar: "Protein B" },
  function_str: "Test function",
  valid: true,
};
const mockSetSimulationResult = vi.fn();

vi.mock("@/components/simulation/contexts/converter-context", () => ({
  useConverter: () => ({
    convertResult: mockConvertResult,
  }),
}));
vi.mock("@/components/simulation/contexts/simulator-context", () => ({
  useSimulator: () => ({
    setSimulationResult: mockSetSimulationResult,
  }),
}));

function createMockWebSocket() {
  const mockSend = vi.fn();
  const mockWebSocketInstance = {
    send: mockSend,
    close: vi.fn(),
    readyState: WebSocket.OPEN,
    onopen: null as ((event: Event) => void) | null,
    onmessage: null as ((event: MessageEvent) => void) | null,
    onerror: null as ((event: Event) => void) | null,
    onclose: null as ((event: CloseEvent) => void) | null,
  };

  const MockWebSocket = vi.fn(() => mockWebSocketInstance as unknown as WebSocket);

  Object.assign(MockWebSocket, {
    CONNECTING: WebSocket.CONNECTING,
    OPEN: WebSocket.OPEN,
    CLOSING: WebSocket.CLOSING,
    CLOSED: WebSocket.CLOSED,
  });

  return { MockWebSocket, mockWebSocketInstance, mockSend };
}

describe("useWebSocketSimulation", () => {
  let originalWebSocket: typeof WebSocket;

  beforeEach(() => {
    vi.clearAllMocks();
    originalWebSocket = global.WebSocket; // save original WebSocket
  });

  afterEach(() => {
    global.WebSocket = originalWebSocket; // restore original WebSocket
  });

  it("opens a WebSocket connection and sends the initial parameters", () => {
    // Arrange
    const { MockWebSocket, mockWebSocketInstance, mockSend } = createMockWebSocket();
    global.WebSocket = MockWebSocket as unknown as typeof WebSocket;

    const proteinParameter = { foo: 10 };

    // Act
    renderHook(() => useWebSocketSimulation(proteinParameter));

    act(() => {
      if (mockWebSocketInstance.onopen) {
        mockWebSocketInstance.onopen(new Event("open"));
      }
    });

    // Assert
    expect(MockWebSocket).toHaveBeenCalledWith(WS_URL);
    expect(mockSend).toHaveBeenCalledWith(JSON.stringify(mockConvertResult));
    expect(mockSend).toHaveBeenCalledWith(JSON.stringify({ params: proteinParameter }));
  });

  it("sends updated parameters when proteinParameter changes", () => {
    // Arrange
    const { MockWebSocket, mockWebSocketInstance, mockSend } = createMockWebSocket();
    global.WebSocket = MockWebSocket as unknown as typeof WebSocket;

    const initialProteinParameter = { foo: 10 };
    const updatedProteinParameter = { foo: 20 };

    const { rerender } = renderHook(({ proteinParameter }) => useWebSocketSimulation(proteinParameter), {
      initialProps: { proteinParameter: initialProteinParameter },
    });

    act(() => {
      if (mockWebSocketInstance.onopen) {
        mockWebSocketInstance.onopen(new Event("open"));
      }
    });

    // Act
    act(() => {
      rerender({ proteinParameter: updatedProteinParameter });
    });

    // Assert
    expect(mockSend).toHaveBeenCalledWith(JSON.stringify({ params: initialProteinParameter }));
    expect(mockSend).toHaveBeenCalledWith(JSON.stringify({ params: updatedProteinParameter }));
  });

  it("receives data and updates simulation result", () => {
    // Arrange
    const { MockWebSocket, mockWebSocketInstance } = createMockWebSocket();
    global.WebSocket = MockWebSocket as unknown as typeof WebSocket;

    const proteinParameter = { foo: 10 };
    const simulationData = [
      [1, 2],
      [3, 4],
    ];

    renderHook(() => useWebSocketSimulation(proteinParameter));

    // Act
    act(() => {
      if (mockWebSocketInstance.onopen) {
        mockWebSocketInstance.onopen(new Event("open"));
      }
    });

    act(() => {
      if (mockWebSocketInstance.onmessage) {
        mockWebSocketInstance.onmessage({ data: JSON.stringify(simulationData) } as MessageEvent);
      }
    });

    // Assert
    expect(mockSetSimulationResult).toHaveBeenCalledWith(simulationData);
  });
});
