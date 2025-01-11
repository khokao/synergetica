import { ApiStatusProvider, useApiStatus } from "@/components/simulation/api-status-context";
import { invoke } from "@tauri-apps/api/core";
import { render, screen } from "@testing-library/react";
import { act } from "@testing-library/react";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const TestComponent = () => {
  const { isHealthcheckOk } = useApiStatus();
  return <div data-testid="healthcheck">{isHealthcheckOk ? "OK" : "NG"}</div>;
};

describe("ApiStatusContext", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
    (console.error as unknown as ReturnType<typeof vi.fn>).mockRestore();
    (console.log as unknown as ReturnType<typeof vi.fn>).mockRestore();
    (console.warn as unknown as ReturnType<typeof vi.fn>).mockRestore();
  });

  it("provides default state (isHealthcheckOk=false) if not yet connected", () => {
    // Arrange & Act
    render(
      <ApiStatusProvider>
        <TestComponent />
      </ApiStatusProvider>,
    );

    // Assert
    expect(screen.getByTestId("healthcheck").textContent).toBe("NG");
  });

  it("calls invoke('call_healthcheck') immediately and every 5 seconds, sets isHealthcheckOk=true on success", async () => {
    // Arrange
    vi.mocked(invoke).mockResolvedValue("ok");

    render(
      <ApiStatusProvider>
        <TestComponent />
      </ApiStatusProvider>,
    );

    // Act
    await act(async () => {
      await Promise.resolve();
    });

    // Assert
    expect(screen.getByTestId("healthcheck").textContent).toBe("OK");
    expect(toast.success).toHaveBeenCalledWith("Connected to server");

    await act(async () => {
      vi.advanceTimersByTime(5000);
      await Promise.resolve();
    });
    expect(invoke).toHaveBeenCalledTimes(3); // 0, n, 2n seconds
  });

  it("does not show 'Connected to server' toast if already connected", async () => {
    // Arrange
    vi.mocked(invoke).mockResolvedValue("ok");

    render(
      <ApiStatusProvider>
        <TestComponent />
      </ApiStatusProvider>,
    );

    // Act
    // First success
    await act(async () => {
      await Promise.resolve();
    });
    // Second success
    await act(async () => {
      vi.advanceTimersByTime(5000);
      await Promise.resolve();
    });

    // Assert
    expect(toast.success).toHaveBeenCalledTimes(1);
  });

  it("sets isHealthcheckOk=false on error, shows 'Disconnected from server' if was previously connected", async () => {
    // Arrange
    vi.mocked(invoke)
      .mockResolvedValueOnce("ok") // 0 seconds
      .mockResolvedValueOnce("ok") // n seconds
      .mockRejectedValueOnce("err"); // 2n seconds

    render(
      <ApiStatusProvider>
        <TestComponent />
      </ApiStatusProvider>,
    );

    // Act
    await act(async () => {
      await Promise.resolve();
    });
    await act(async () => {
      vi.advanceTimersByTime(5000);
      await Promise.resolve();
    });

    expect(screen.getByTestId("healthcheck").textContent).toBe("NG");
    expect(toast.error).toHaveBeenCalledWith("Disconnected from server");
    expect(console.error).toHaveBeenCalledWith("Healthcheck failed", "err");
  });

  it("sets isHealthcheckOk=false on error, but does not show 'Disconnected from server' if it was never connected", async () => {
    // Arrange
    vi.mocked(invoke).mockRejectedValue("some error");

    render(
      <ApiStatusProvider>
        <TestComponent />
      </ApiStatusProvider>,
    );

    // Act
    await act(async () => {
      await Promise.resolve();
    });

    // Assert
    expect(screen.getByTestId("healthcheck").textContent).toBe("NG");
    expect(toast.error).not.toHaveBeenCalledWith("Disconnected from server");
    expect(console.error).toHaveBeenCalledWith("Healthcheck failed", "some error");
  });
});
