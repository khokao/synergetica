import { render, screen, fireEvent } from "@testing-library/react";
import { ChildSelectModal } from "@/components/circuit/nodes/child-select-modal";

import { describe, it, expect } from "vitest";


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


describe("ChildSelectModal", () => {
  const defaultId = "test-id";
  const defaultData = {nodeCategory: "promoter", nodePartsName: "test-name"}

  const renderComponent = () => {
    render(<ChildSelectModal id={defaultId} data={defaultData} />);
  }

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
    const partsDescription = "Regulated Promoter repressed by AmeR"; // PameR

    // Act
    fireEvent.click(screen.getByTestId("select-modal-button"));
    fireEvent.click(screen.getByText(partsDescription));

    // Assert
    expect(screen.queryByTestId("select-menu")).not.toBeInTheDocument();
  });
});
