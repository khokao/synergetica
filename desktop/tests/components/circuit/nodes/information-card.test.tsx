import { InformationCard } from "@/components/circuit/nodes/information-card";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@xyflow/react", async () => {
  const actual = await vi.importActual("@xyflow/react");
  return {
    ...actual,
    ReactFlowProvider: ({ children }) => <div>{children}</div>,
    ReactFlow: () => <div data-testid="select-modal-preview-flow" />,
    useReactFlow: () => ({
      getNodes: vi.fn(() => []),
      getEdges: vi.fn(() => []),
      setNodes: vi.fn(),
    }),
  };
});

const testPromoter1Part = {
  name: "testPromoter1",
  description: "Test Promoter 1 Description",
  category: "Promoter",
  sequence: "atcg",
  controlBy: [
    {
      name: "testProtein1",
      type: "Repression",
      params: {
        Ymax: 1.0,
        Ymin: 1.0,
        K: 1.0,
        n: 1.0,
      },
    },
  ],
  params: {
    Ydef: 1.0,
  },
};

const testProtein1Part = {
  name: "testProtein1",
  description: "Test Protein 1 Description",
  category: "Protein",
  sequence: "atcg",
  controlBy: [],
  params: {
    Dp: 1.0,
    TIRb: 1.0,
  },
};

const testTerminator1Part = {
  name: "testTerminator1",
  description: "Test Terminator 1 Description",
  category: "Terminator",
  sequence: "atcg",
  controlBy: [],
  params: {},
};

const testInteractionStore = {
  getPromotersByProtein: vi.fn((from) => [{ to: testPromoter1Part.name, type: "Repression" }]),
  getProteinsByPromoter: vi.fn((to) => [{ from: testProtein1Part.name, type: "Repression" }]),
};

vi.mock("@/components/circuit/parts/parts-context", () => {
  return {
    useParts: () => ({
      parts: {
        testPromoter1: testPromoter1Part,
        testProtein1: testProtein1Part,
        testTerminator1: testTerminator1Part,
      },
      promoterParts: {
        testPromoter1: testPromoter1Part,
      },
      proteinParts: {
        testProtein1: testProtein1Part,
      },
      terminatorParts: {
        testTerminator1: testTerminator1Part,
      },
      interactionStore: testInteractionStore,
    }),
  };
});

describe("InformationCard", () => {
  it("renders name, description, control section", () => {
    // Arrange & Act
    render(<InformationCard data={testPromoter1Part} />);

    // Assert
    expect(screen.getByTestId("information-card-title")).toHaveTextContent(testPromoter1Part.name);
    expect(screen.getByTestId("information-card-description")).toHaveTextContent(testPromoter1Part.description);
    expect(screen.getByTestId("information-card-control-section")).toHaveTextContent(testPromoter1Part.name);
    expect(screen.getByTestId("repression-icon")).toBeInTheDocument();
    expect(screen.getByTestId("information-card-control-section")).toHaveTextContent(
      testPromoter1Part.controlBy[0].name,
    );
  });
});
