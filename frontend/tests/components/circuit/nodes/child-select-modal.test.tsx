import { ChildSelectModal } from "@/components/circuit/nodes/child-select-modal";
import { fireEvent, render, screen } from "@testing-library/react";

import { describe, expect, it } from "vitest";

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

vi.mock("@/components/circuit/parts/parts-context", () => {
  return {
    useParts: () => ({
      promoterParts: {
        testPromoterName: {
          name: "testPromoterName",
          description: "Test Promoter Description",
          category: "promoter",
          controlBy: [],
          controlTo: [],
        },
      },
      proteinParts: {
        testProteinName: {
          name: "testProteinName",
          description: "Test Protein Description",
          category: "protein",
          controlBy: [],
          controlTo: [],
        },
      },
      terminatorParts: {
        testTerminatorName: {
          name: "testTerminatorName",
          description: "Test Terminator Description",
          category: "terminator",
          controlBy: [],
          controlTo: [],
        },
      },
    }),
  };
});

describe("ChildSelectModal", () => {
  const defaultId = "test-id";
  const defaultData = { category: "promoter", name: "test-name" };

  const renderComponent = () => {
    render(<ChildSelectModal id={defaultId} data={defaultData} />);
  };

  it("renders the SelectMenu and CircuitPreview", async () => {
    // Arrange
    renderComponent();

    // Act
    fireEvent.click(screen.getByTestId("select-modal-button"));

    // Assert
    expect(screen.getByTestId("select-menu")).toBeInTheDocument();
    expect(screen.getByTestId("select-modal-preview-flow")).toBeInTheDocument();
  });

  it("fires the click event and closes the modal", async () => {
    // Arrange
    renderComponent();
    const partsDescription = "Test Promoter Description";

    // Act
    fireEvent.click(screen.getByTestId("select-modal-button"));
    fireEvent.click(screen.getByText(partsDescription));

    // Assert
    expect(screen.queryByTestId("select-menu")).not.toBeInTheDocument();
  });
});
