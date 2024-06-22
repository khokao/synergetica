import { Simulation } from "@/components/Simulation/Simulation";
import { ResponseProvider, useResponse } from "@/context/GeneratorResponseContext";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/context/GeneratorResponseContext", async () => {
  const actual = await vi.importActual<typeof import("@/context/GeneratorResponseContext")>(
    "@/context/GeneratorResponseContext",
  );
  return {
    ...actual,
    useResponse: vi.fn(),
  };
});

describe("Simulation Component", () => {
  const ActualResponseProvider = ResponseProvider;
  const generateButtonText = "Generate";

  let mockCallGeneratorAPI: Mock;

  beforeEach(() => {
    mockCallGeneratorAPI = vi.fn();
    (useResponse as Mock).mockReturnValue({ callGeneratorAPI: mockCallGeneratorAPI });
  });

  afterEach(() => {
    cleanup();
  });

  const renderSimulation = () =>
    render(
      <ActualResponseProvider>
        <Simulation />
      </ActualResponseProvider>,
    );

  // Temporary test, will be unnecessary as development progresses.
  it("displays the Simulation Section text", () => {
    renderSimulation();

    const sectionText = screen.getByText("Simulation Section");

    expect(sectionText).toBeInTheDocument();
  });

  it("calls callGeneratorAPI when the Generate button is clicked", () => {
    renderSimulation();
    const button = screen.getByText(generateButtonText);

    fireEvent.click(button);

    expect(mockCallGeneratorAPI).toHaveBeenCalled();
  });
});
