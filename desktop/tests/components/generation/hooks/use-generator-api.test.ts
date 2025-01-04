import { callGeneratorAPI, cancelGeneratorAPI } from "@/components/generation/hooks/use-generator-api";
import { invoke } from "@tauri-apps/api/core";
import { describe, expect, it, vi } from "vitest";

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));

describe("callGeneratorAPI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call invoke with correct parameters and return response data", async () => {
    // Arrange
    vi.mocked(invoke).mockResolvedValue({});

    const requestData = {
      proteinTargetValues: { "child-1": 10, "child-2": 20 },
      proteinInitSequences: { "child-1": "AAATTT", "child-2": "CCCGGG" },
    };

    // Act
    await callGeneratorAPI(requestData);

    // Assert
    expect(invoke).toHaveBeenCalledWith("call_generator_api", requestData);
  });
});

describe("cancelGeneratorAPI", () => {
  it("should call invoke with cancel_generator_api", async () => {
    // Arrange
    vi.mocked(invoke).mockResolvedValue(null);

    // Act
    await cancelGeneratorAPI();

    // Assert
    expect(invoke).toHaveBeenCalledWith("cancel_generator_api");
  });
});
