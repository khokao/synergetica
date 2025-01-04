import { useEditorContext } from "@/components/editor/editor-context";
import { Simulation } from "@/components/simulation/simulation";
import { useSimulator } from "@/components/simulation/simulator-context";
import { render, screen } from "@testing-library/react";
import { ReactFlowProvider } from "@xyflow/react";
import { describe, expect, it, vi } from "vitest";

const defaultEditorContext = {
  validationError: [],
  // biome-ignore  lint/suspicious/noExplicitAny: For brevity and clarity.
} as any;

const defaultSimulatorContext = {
  solutions: [],
  formulate: vi.fn(),
  reset: vi.fn(),
  // biome-ignore  lint/suspicious/noExplicitAny: For brevity and clarity.
} as any;

function setupMocks({
  editor = {},
  simulator = {},
}: {
  editor?: Partial<typeof defaultEditorContext>;
  simulator?: Partial<typeof defaultSimulatorContext>;
} = {}) {
  vi.mocked(useEditorContext).mockReturnValue({
    ...defaultEditorContext,
    ...editor,
  });
  vi.mocked(useSimulator).mockReturnValue({
    ...defaultSimulatorContext,
    ...simulator,
  });
}

vi.mock("@/components/simulation/simulator-context", () => ({
  useSimulator: vi.fn(),
}));

vi.mock("@/components/editor/editor-context", () => ({
  useEditorContext: vi.fn(),
}));

describe("Simulation Component", () => {
  const originalWarn = console.warn;
  beforeAll(() => {
    console.warn = (...args) => {
      if (args[0]?.includes("maybe you don't need to use a ResponsiveContainer")) {
        return;
      }
      originalWarn(...args);
    };
  });
  afterAll(() => {
    console.warn = originalWarn;
  });

  it("displays message for empty circuit when validationError is null", () => {
    // Arrange
    setupMocks({ editor: { validationError: null } });

    // Act
    render(<Simulation />);

    // Assert
    expect(screen.getByText("Empty circuit.")).toBeInTheDocument();
    expect(screen.getByText("Build the circuit first.")).toBeInTheDocument();
  });

  it("displays message for invalid circuit when validationError has errors", () => {
    // Arrange
    setupMocks({ editor: { validationError: [{ message: "Error", line: 1 }] } });
    // Act
    render(<Simulation />);

    // Assert
    expect(screen.getByText("Invalid circuit.")).toBeInTheDocument();
    expect(screen.getByText("Please check the validation error.")).toBeInTheDocument();
  });

  it("displays message when no simulation data and validationError is empty", () => {
    // Arrange
    setupMocks({
      editor: { validationError: [] },
      simulator: { solutions: [] },
    });

    // Act
    render(<Simulation />);

    // Assert
    expect(screen.getByText("No simulation data.")).toBeInTheDocument();
    expect(screen.getByText("Click 'Simulate' button.")).toBeInTheDocument();
  });

  it("renders Chart, Sliders, and GenerationButtons when validationError is empty and solutions is available", () => {
    // Arrange
    setupMocks({
      editor: { validationError: [] },
      simulator: {
        solutions: [{ time: 0, ProteinA: 100 }],
        proteinName2Ids: { ProteinA: ["child-1"] },
        proteinParameters: { "child-1": 100 },
        setProteinParameters: vi.fn(),
      },
    });

    // https://github.com/recharts/recharts/issues/2982
    vi.mock("recharts", async () => {
      const OriginalModule = await vi.importActual<typeof import("recharts")>("recharts");

      return {
        ...OriginalModule,
        ResponsiveContainer: ({ children }) => (
          <OriginalModule.ResponsiveContainer width={800} height={800}>
            {children}
          </OriginalModule.ResponsiveContainer>
        ),
      };
    });

    // Act
    render(
      <ReactFlowProvider>
        <Simulation />
      </ReactFlowProvider>,
    );

    // Assert
    expect(screen.getByTestId("chart-card")).toBeInTheDocument();
    expect(screen.getByRole("slider")).toBeInTheDocument();
    expect(screen.getByTestId("run-button")).toBeInTheDocument();
    expect(screen.getByTestId("result-button")).toBeInTheDocument();
  });
});
