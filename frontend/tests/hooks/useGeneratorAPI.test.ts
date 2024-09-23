import { callGeneratorAPI, cancelGeneratorAPI } from "@/hooks/useGeneratorAPI";
import type { GeneratorResponseData, generatorRequestData } from "@/interfaces/generatorAPI";
import { invoke } from "@tauri-apps/api/tauri";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@tauri-apps/api/tauri", () => ({
  invoke: vi.fn(),
}));

describe("Generator API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockData: generatorRequestData = {
    reactflow_object_json_str: JSON.stringify({
      nodes: [
        { id: "foobar", type: "parent" },
        { id: "foo", type: "child", data: { nodeCategory: "protein" } },
        { id: "bar", type: "child", data: { nodeCategory: "terminator" } },
      ],
    }),
    rbs_target_parameters: { foo: 100 },
  };
  const mockResponse: GeneratorResponseData = {
    parent2child_details: {
      foobar: [
        { nodeCategory: "protein", sequence: "ATGC" },
        { nodeCategory: "terminator", sequence: "ATGC" },
      ],
    },
  };

  describe("callGeneratorAPI", () => {
    it("should call invoke with correct parameters and return response data", async () => {
      // Arrange
      (invoke as Mock).mockResolvedValue(mockResponse);

      // Act
      const result = await callGeneratorAPI(mockData);

      // Assert
      expect(invoke).toHaveBeenCalledWith("call_generator_api", {
        reactflowObjectJsonStr: mockData.reactflow_object_json_str,
        rbsTargetParameters: mockData.rbs_target_parameters,
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

    describe("cancelGeneratorAPI", () => {
      it('should call invoke with "cancel_generator_api"', async () => {
        (invoke as Mock).mockResolvedValue(undefined);

        await cancelGeneratorAPI();

        expect(invoke).toHaveBeenCalledWith("cancel_generator_api");
      });

      it("should handle invoke rejection", async () => {
        const errorMessage = "Cancel API call failed";
        (invoke as Mock).mockRejectedValue(new Error(errorMessage));

        await expect(cancelGeneratorAPI()).rejects.toThrow(errorMessage);

        expect(invoke).toHaveBeenCalledWith("cancel_generator_api");
      });
    });
  });
});
