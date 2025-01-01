import { useGenerator } from "@/components/generation/hooks/use-generator";
import { callGeneratorAPI, cancelGeneratorAPI } from "@/components/generation/hooks/use-generator-api";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockNodes = [
  { id: "parent-1", type: "parent", position: { x: 0, y: 0 }, data: { showParentId: false } },
  {
    id: "child-1",
    type: "child",
    position: { x: 0, y: 0 },
    data: { name: "Promoter A", category: "Promoter", sequence: "A" },
  },
  {
    id: "child-2",
    type: "child",
    position: { x: 0, y: 0 },
    data: { name: "Protein A", category: "Protein", sequence: "T" },
  },
  {
    id: "child-3",
    type: "child",
    position: { x: 0, y: 0 },
    data: { name: "Protein B", category: "Protein", sequence: "T" },
  },
  {
    id: "child-4",
    type: "child",
    position: { x: 0, y: 0 },
    data: { name: "Terminator A", category: "Terminator", sequence: "CG" },
  },
];
const mockEdges = [];

const mockProteinParameters = {
  "child-2": 10,
  "child-3": 20,
};

vi.mock("@xyflow/react", () => ({
  useReactFlow: vi.fn().mockReturnValue({
    getNodes: vi.fn(() => mockNodes),
    getEdges: vi.fn(() => mockEdges),
  }),
}));

vi.mock("@/components/generation/hooks/use-generator-api", () => ({
  callGeneratorAPI: vi.fn(),
  cancelGeneratorAPI: vi.fn(),
}));

vi.mock("@/components/simulation/contexts/protein-parameter-context", () => ({
  useProteinParameters: () => ({
    proteinParameter: mockProteinParameters,
  }),
}));

describe("useGenerator Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("generates data and calls generator API with correct parameters", async () => {
    // Arrange
    const mockResponse = {
      protein_generated_sequences: { "child-2": "AAAATT", "child-3": "CCCCGG" },
    };
    vi.mocked(callGeneratorAPI).mockResolvedValue(mockResponse);

    // Act & Assert
    const { result } = renderHook(() => useGenerator());
    expect(result.current.isGenerating).toBe(false);

    // biome-ignore lint/suspicious/noImplicitAnyLet: It's okay to use let here
    let generatePromise;
    act(() => {
      generatePromise = result.current.generate();
    });
    expect(result.current.isGenerating).toBe(true);

    // biome-ignore lint/suspicious/noImplicitAnyLet: It's okay to use let here
    let resolvedResult;
    await act(async () => {
      resolvedResult = await generatePromise;
    });
    expect(result.current.isGenerating).toBe(false);

    expect(callGeneratorAPI).toHaveBeenCalledTimes(1);
    expect(resolvedResult.snapshot).toEqual({
      nodes: mockNodes,
      edges: mockEdges,
      proteinParameters: mockProteinParameters,
    });
    expect(resolvedResult.response).toEqual(mockResponse);
  });

  it("calls cancelGeneratorAPI when cancel is invoked", async () => {
    // Arrange
    const { result } = renderHook(() => useGenerator());

    // Act
    await result.current.cancel();

    // Assert
    expect(cancelGeneratorAPI).toHaveBeenCalledTimes(1);
  });
});
