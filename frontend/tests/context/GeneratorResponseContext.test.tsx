// import { randomFillSync } from "node:crypto";
import { randomFillSync } from "crypto";
import { ResponseProvider, useResponse } from "@/context/GeneratorResponseContext";
import { clearMocks, mockIPC } from "@tauri-apps/api/mocks";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(() => {
  Object.defineProperty(window, "crypto", {
    value: {
      getRandomValues: (buffer) => randomFillSync(buffer),
    },
  });
});

describe("GeneratorResponseContext", () => {
  afterEach(() => {
    clearMocks();
  });

  const setupHook = () => {
    const wrapper = ({ children }) => <ResponseProvider>{children}</ResponseProvider>;
    return renderHook(() => useResponse(), { wrapper });
  };

  it("initially has null response and updates response on successful API call", async () => {
    const mockResponseData = { rbs_sequence: "ATGCATGCATGC", promoter_sequence: "ATGCAATTGGCC" };

    // Arrange
    mockIPC((cmd) => {
      if (cmd === "call_generator_api") return mockResponseData;
    });

    const { result } = setupHook();
    expect(result.current.response).toBe(null);

    // Act
    await act(async () => {
      await result.current.callGeneratorAPI({
        rbs_parameter: 0.5,
        rbs_upstream: "ATG",
        rbs_downstream: "TAA",
        promoter_parameter: 0.5,
        promoter_upstream: "TATA",
      });
    });

    // Assert
    expect(result.current.response).toEqual(mockResponseData);
  });

  it("updates response with error message on API call failure", async () => {
    const mockError = { error: "Something went wrong" };

    // Arrange
    mockIPC((cmd) => {
      if (cmd === "call_generator_api") throw new Error(mockError.error);
    });

    const { result } = setupHook();
    expect(result.current.response).toBe(null);

    // Act
    await act(async () => {
      await result.current.callGeneratorAPI({
        rbs_parameter: 0.5,
        rbs_upstream: "ATG",
        rbs_downstream: "TAA",
        promoter_parameter: 0.5,
        promoter_upstream: "TATA",
      });
    });

    // Assert
    expect(result.current.response).toEqual(mockError);
  });

  it("throws an error if useResponse is used outside of ResponseProvider", () => {
    expect(() => renderHook(() => useResponse())).toThrowError("useResponse must be used within a ResponseProvider");
  });
});
