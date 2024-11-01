import { callGeneratorAPI, cancelGeneratorAPI } from "@/components/generation/hooks/use-generator-api";
import { invoke } from "@tauri-apps/api/core";
import { type Mock, describe, expect, it, vi } from "vitest";

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));

const mockGeneratorResponse = {
  parent2child_details: {
    parent1: [
      { nodeCategory: "category1", sequence: "seq1" },
      { nodeCategory: "category2", sequence: "seq2" },
    ],
  },
};

describe("callGeneratorAPI", () => {
  it("should call invoke with correct parameters and return response data", async () => {
    // Arrange
    (invoke as Mock).mockResolvedValue(mockGeneratorResponse);

    const requestData = {
      reactflowObjectJsonStr: JSON.stringify({ nodes: [], edges: [] }),
      rbsTargetParameters: { param1: 10, param2: 20 },
    };

    // Act
    const result = await callGeneratorAPI(requestData);

    // Assert
    expect(invoke).toHaveBeenCalledWith("call_generator_api", {
      reactflowObjectJsonStr: requestData.reactflowObjectJsonStr,
      rbsTargetParameters: requestData.rbsTargetParameters,
    });
    expect(result).toEqual(mockGeneratorResponse);
  });
});

describe("cancelGeneratorAPI", () => {
  it("should call invoke with cancel_generator_api", async () => {
    // Arrange
    (invoke as Mock).mockResolvedValue(null);

    // Act
    await cancelGeneratorAPI();

    // Assert
    expect(invoke).toHaveBeenCalledWith("cancel_generator_api");
  });
});
