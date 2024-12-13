import { cancelGeneratorAPI } from "@/components/generation/hooks/use-generator-api";
import { useGeneratorData } from "@/components/generation/hooks/use-generator-data";
import { useProteinParameters } from "@/components/simulation/contexts/protein-parameter-context";
import { act, renderHook } from "@testing-library/react";
import { useReactFlow } from "@xyflow/react";
import useSWRMutation from "swr/mutation";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/generation/hooks/use-generator-api", () => ({
  cancelGeneratorAPI: vi.fn(),
}));

vi.mock("@/components/simulation/contexts/protein-parameter-context", () => ({
  useProteinParameters: vi.fn(),
}));

vi.mock("@xyflow/react", () => ({
  useReactFlow: vi.fn(),
}));

vi.mock("swr/mutation", () => ({
  default: vi.fn(),
}));

describe("useGeneratorData Hook", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("initializes with default values", () => {
    // Arrange
    const mockProteinParameters = { proteinParameter: { param1: 100 } };
    const mockReactFlow = {
      getNodes: vi.fn().mockReturnValue([]),
      getEdges: vi.fn().mockReturnValue([]),
      toObject: vi.fn().mockReturnValue({ nodes: [], edges: [] }),
    };
    const mockSWR = {
      data: null,
      trigger: vi.fn(),
      isMutating: false,
      reset: vi.fn(),
    };

    (useProteinParameters as Mock).mockReturnValue(mockProteinParameters);
    (useReactFlow as Mock).mockReturnValue(mockReactFlow);
    (useSWRMutation as Mock).mockReturnValue(mockSWR);

    // Act
    const { result } = renderHook(() => useGeneratorData());

    // Assert
    expect(result.current.data).toBeNull();
    expect(result.current.snapshot).toBeNull();
    expect(result.current.isMutating).toBe(false);
  });

  it("generates data and calls generator API with correct parameters", async () => {
    // Arrange
    const mockProteinParameters = { proteinParameter: { param1: 100 } };
    const mockNodes = [{ id: "1", type: "node1" }];
    const mockEdges = [{ id: "e1", source: "1", target: "2" }];
    const mockReactFlow = {
      getNodes: vi.fn().mockReturnValue(mockNodes),
      getEdges: vi.fn().mockReturnValue(mockEdges),
      toObject: vi.fn().mockReturnValue({ nodes: mockNodes, edges: mockEdges }),
    };
    const mockTrigger = vi.fn().mockResolvedValue({
      parent2child_details: {},
    });
    const mockReset = vi.fn();

    (useProteinParameters as Mock).mockReturnValue(mockProteinParameters);
    (useReactFlow as Mock).mockReturnValue(mockReactFlow);
    (useSWRMutation as Mock).mockReturnValue({
      data: null,
      trigger: mockTrigger,
      isMutating: false,
      reset: mockReset,
    });

    // Act
    const { result } = renderHook(() => useGeneratorData());

    await act(async () => {
      await result.current.generate();
    });

    // Assert
    expect(mockTrigger).toHaveBeenCalledWith({
      reactflowObjectJsonStr: JSON.stringify({ nodes: mockNodes, edges: mockEdges }),
      rbsTargetParameters: mockProteinParameters.proteinParameter,
    });
    expect(mockReset).toHaveBeenCalled();
  });

  it("cancels the generator API call", async () => {
    // Arrange
    const mockProteinParameters = { proteinParameter: { param1: 100 } };
    const mockSWR = {
      data: null,
      trigger: vi.fn(),
      isMutating: false,
      reset: vi.fn(),
    };
    (useProteinParameters as Mock).mockReturnValue(mockProteinParameters);
    (useSWRMutation as Mock).mockReturnValue(mockSWR);
    (cancelGeneratorAPI as Mock).mockResolvedValue(undefined);

    // Act
    const { result } = renderHook(() => useGeneratorData());

    await act(async () => {
      await result.current.cancel();
    });

    // Assert
    expect(cancelGeneratorAPI).toHaveBeenCalled();
  });
});
