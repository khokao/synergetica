import { SimulatorProvider, useSimulator } from "@/components/simulation/simulator-context";
import { act, renderHook } from "@testing-library/react";
import { ReactFlowProvider } from "@xyflow/react";
import { describe, expect, it } from "vitest";

// This test focuses on checking the context default state and the basic reset functionality.
// WebSocket logic and highlightNodes are excluded, as they require integration tests or UI tests.

describe("SimulatorContext provides basic data handling", () => {
  it("provides default state when initialized with no external data", () => {
    // Arrange
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ReactFlowProvider>
        <SimulatorProvider>{children}</SimulatorProvider>
      </ReactFlowProvider>
    );

    // Act
    const { result } = renderHook(() => useSimulator(), { wrapper });

    // Assert
    expect(result.current.solutions).toEqual([]);
    expect(Object.keys(result.current.proteinName2Ids)).toHaveLength(0);
    expect(Object.keys(result.current.proteinParameters)).toHaveLength(0);
  });

  it("clears solutions array when reset is called", async () => {
    // Arrange
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ReactFlowProvider>
        <SimulatorProvider>{children}</SimulatorProvider>
      </ReactFlowProvider>
    );
    const { result } = renderHook(() => useSimulator(), { wrapper });
    result.current.solutions.push({ time: 0, proteinX: 123 });

    // Act
    await act(async () => result.current.reset());

    // Assert
    expect(result.current.solutions).toEqual([]);
  });
});
