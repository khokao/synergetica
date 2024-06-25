import { Simulation } from "@/components/Simulation/Simulation";
import { callGeneratorAPI } from "@/hooks/useGeneratorAPI";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/useGeneratorAPI", () => ({
  callGeneratorAPI: vi.fn(),
}));

vi.mock("@/hooks/useSimulatorAPI", () => ({
  callSimulatorAPI: vi.fn(),
}));

describe("Simulation Component", () => {
  afterEach(() => {
    cleanup();
  });

  const renderSimulation = () => render(<Simulation />);

  it("displays the Simulation Section text", () => {
    renderSimulation();

    const sectionText = screen.getByText("Simulation Section");

    expect(sectionText).toBeInTheDocument();
  });

  it("calls callGeneratorAPI when the Generate button is clicked", async () => {
    renderSimulation();
    const button = screen.getByText("Generate");

    fireEvent.click(button);

    await waitFor(() => {
      expect(callGeneratorAPI).toHaveBeenCalled();
    });
  });
});
