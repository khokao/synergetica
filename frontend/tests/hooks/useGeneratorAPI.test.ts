import { callGeneratorAPI } from "@/hooks/useGeneratorAPI";
import type { GeneratorResponseData, generatorRequestData } from "@/interfaces/generatorAPI";
import { invoke } from "@tauri-apps/api/tauri";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@tauri-apps/api/tauri", () => ({
  invoke: vi.fn(),
}));

describe("callGeneratorAPI function", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const mockData: generatorRequestData = {
    rbs_parameter: 0.5,
    rbs_upstream: "ATG",
    rbs_downstream: "TAA",
    promoter_parameter: 0.5,
    promoter_upstream: "TATA",
  };

  it("invokes the correct parameters", async () => {
    // Arrange
    const mockResponse: GeneratorResponseData = {
      rbs_sequence: "mock_rbs_sequence",
      promoter_sequence: "mock_promoter_sequence",
    };
    (invoke as Mock).mockResolvedValueOnce(mockResponse);

    // Act
    const result = await callGeneratorAPI(mockData);

    // Assert
    expect(invoke).toHaveBeenCalledWith("call_generator_api", {
      rbsParameter: mockData.rbs_parameter,
      rbsUpstream: mockData.rbs_upstream,
      rbsDownstream: mockData.rbs_downstream,
      promoterParameter: mockData.promoter_parameter,
      promoterUpstream: mockData.promoter_upstream,
    });
    expect(result).toEqual(mockResponse);
  });

  it("handles errors correctly", async () => {
    // Arrange
    const mockError = new Error("Test error");
    (invoke as Mock).mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(callGeneratorAPI(mockData)).rejects.toThrow("Test error");
  });
});
