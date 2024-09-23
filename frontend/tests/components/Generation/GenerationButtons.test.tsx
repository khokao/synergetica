import { GenerationButtons } from "@/components/Generation/GenerationButtons";
import * as api from "@/hooks/useGeneratorAPI";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { ReactFlowProvider } from "reactflow";
import { type Middleware, SWRConfig } from "swr";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/useGeneratorAPI", () => ({
  callGeneratorAPI: vi.fn(),
  cancelGeneratorAPI: vi.fn(),
}));

const mockUseSWRMutation: Middleware = (useSWRNext) => {
  return (key, fetcher, config) => {
    const [isMutating, setIsMutating] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const trigger = () => {
      setIsMutating(true);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            const result = { result: "mocked result" };
            setData(result);
            setIsMutating(false);
            resolve(result);
          } catch (err) {
            setError(err);
            setIsMutating(false);
            reject(err);
          }
        }, 30); // Simulate a delay
      });
    };

    const swrResponse = useSWRNext(key, fetcher, config);

    return {
      ...swrResponse,
      data,
      error,
      isMutating,
      trigger,
      mutate: swrResponse.mutate,
      isValidating: swrResponse.isValidating,
    };
  };
};

const renderComponent = () => {
  return render(
    <SWRConfig value={{ use: [mockUseSWRMutation] }}>
      <ReactFlowProvider>
        <GenerationButtons simulatorResult={{}} />
      </ReactFlowProvider>
    </SWRConfig>,
  );
};

const getButtons = () => ({
  generateButton: screen.queryByRole("button", { name: "Generate" }), // null when not found
  cancelButton: screen.getByRole("button", { name: "Cancel" }),
  showButton: screen.getByRole("button", { name: "Show" }),
});

const clickGenerateAndWait = async () => {
  const { generateButton } = getButtons();
  await act(async () => {
    generateButton?.click();
  });
  await waitFor(() => {
    expect(screen.getByRole("button", { name: "Generating" })).toBeInTheDocument();
  });
};

describe("GenerationButtons", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    renderComponent();
  });

  it("renders Generate, Cancel, and Show buttons", () => {
    const { generateButton, cancelButton, showButton } = getButtons();

    expect(generateButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
    expect(showButton).toBeInTheDocument();
  });

  it("handles the generate button click", async () => {
    await clickGenerateAndWait();

    await waitFor(() => {
      const { generateButton } = getButtons();
      expect(generateButton).toBeInTheDocument(); // Generate button should be back
    });
  });

  describe("Cancel Button", () => {
    it("is disabled when not mutating", () => {
      const { cancelButton } = getButtons();
      expect(cancelButton).toBeDisabled();
    });

    it("is enabled when mutating", async () => {
      await clickGenerateAndWait();
      const { cancelButton } = getButtons();
      expect(cancelButton).not.toBeDisabled();
    });

    it("calls cancelGeneratorAPI when clicked", async () => {
      const cancelGeneratorMock = vi.spyOn(api, "cancelGeneratorAPI");

      await clickGenerateAndWait();
      const { cancelButton } = getButtons();
      await act(async () => {
        fireEvent.click(cancelButton);
      });

      expect(cancelGeneratorMock).toHaveBeenCalled();
    });
  });

  describe("Show Button", () => {
    it("is disabled when no data is available", () => {
      const { showButton } = getButtons();
      expect(showButton).toBeDisabled();
    });

    it("is enabled when data is available", async () => {
      await clickGenerateAndWait();
      await waitFor(() => {
        const { showButton } = getButtons();
        expect(showButton).not.toBeDisabled();
      });
    });
  });
});
