import { callCircuitConverterAPI } from "@/components/simulation/hooks/use-simulator-api";
import { invoke } from "@tauri-apps/api/core";
import { type Mock, describe, expect, it, vi } from "vitest";

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));

const mockResponse = {
  protein_id2name: { foo: "Protein A", bar: "Protein B" },
  function_str: "Test function",
  valid: true,
};

describe("callCircuitConverterAPI", () => {
  it("should call invoke with correct parameters and return response data", async () => {
    // Arrange
    (invoke as Mock).mockResolvedValue(mockResponse);

    const requestData = {
      reactflowObjectJsonStr: JSON.stringify({ nodes: [], edges: [] }),
    };

    // Act
    const result = await callCircuitConverterAPI(requestData);

    // Assert
    expect(invoke).toHaveBeenCalledWith("call_circuit_converter_api", {
      reactflowObjectJsonStr: requestData.reactflowObjectJsonStr,
    });
    expect(result).toEqual(mockResponse);
  });
});
