import { Chart } from "@/components/simulation/chart";
import { useSimulator } from "@/components/simulation/simulator-context";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/simulation/simulator-context", () => ({
  useSimulator: vi.fn(),
}));

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

describe("Chart Component", () => {
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing if solutions is empty", () => {
    // Arrange
    vi.mocked(useSimulator).mockReturnValue({
      solutions: [],
      proteinName2Ids: {},
      proteinParameters: {},
      // biome-ignore  lint/suspicious/noExplicitAny: For brevity and clarity.
    } as any);

    // Act
    const { container } = render(<Chart />);

    // Assert
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the chart when solutions is provided", () => {
    // Arrange
    vi.mocked(useSimulator).mockReturnValue({
      solutions: [{ time: 0, ProteinA: 100, ProteinB: 200 }],
      proteinName2Ids: { ProteinA: ["child-1"], ProteinB: ["child-2", "child-3"] },
      proteinParameters: { "child-1": 100, "child-2": 200, "child-3": 300 },
      // biome-ignore  lint/suspicious/noExplicitAny: For brevity and clarity.
    } as any);

    // Act
    render(<Chart />);

    // Assert
    expect(screen.getByTestId("chart-card")).toBeInTheDocument();
    expect(screen.getByTestId("chart-card")).toHaveTextContent("ProteinA");
    expect(screen.getByTestId("chart-card")).toHaveTextContent("ProteinB [1,2]");
  });
});
