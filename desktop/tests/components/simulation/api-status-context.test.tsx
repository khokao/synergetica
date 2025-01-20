import { ApiStatusProvider, useApiStatus } from "@/components/simulation/api-status-context";
import { invoke } from "@tauri-apps/api/core";
import { render, screen } from "@testing-library/react";
import { act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
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

    await act(async () => {
      vi.advanceTimersByTime(5000);
      await Promise.resolve();
    });
    expect(invoke).toHaveBeenCalledTimes(2); // 0, n seconds
  });

  it("sets isHealthcheckOk=false on error", async () => {
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
    expect(console.error).toHaveBeenCalledWith("Healthcheck failed", "some error");
  });
});
