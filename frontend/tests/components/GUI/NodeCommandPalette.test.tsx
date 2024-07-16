import { NodeCommandPalette, updateNodeMetadata } from "@/components/GUI/NodeCommandPalette";
import { promoterCommandPaletteOptions } from "@/components/GUI/nodes/promoterNode";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { ReactFlowProvider } from "reactflow";
import { describe, expect, it } from "vitest";

const nodeCategory = "promoter";
const nodeId = "test-node-id";

const renderComponent = () => {
  return render(
    <ReactFlowProvider>
      <NodeCommandPalette nodeCategory={nodeCategory} nodeId={nodeId} />
    </ReactFlowProvider>,
  );
};

describe("updateNodeMetadata", () => {
  it("should update the node metadata correctly", () => {
    const nodes = [
      {
        id: nodeId,
        position: { x: 0, y: 0 },
        data: { nodeSubcategory: undefined, nodePartsName: undefined, controlBy: null, controlTo: null, meta: null },
      },
      {
        id: "another-node-id",
        position: { x: 0, y: 0 },
        data: { nodeSubcategory: undefined, nodePartsName: undefined, controlBy: null, controlTo: null, meta: null },
      },
    ];
    const option = {
      name: "newName",
      description: "newDescription",
      subcategory: "newCategory",
      controlBy: {
        newControlBy: {
          controlType: "newControlType",
        },
      },
      controlTo: null,
      meta: null,
    };

    const updatedNodes = updateNodeMetadata(nodes, nodeId, option);

    expect(updatedNodes[0].data).toEqual({
      nodeSubcategory: "newCategory",
      nodePartsName: "newName",
      controlBy: {
        newControlBy: {
          controlType: "newControlType",
        },
      },
      controlTo: null,
      meta: null,
    });
    expect(updatedNodes[1].data).toEqual({
      nodeSubcategory: undefined,
      nodePartsName: undefined,
      controlBy: null,
      controlTo: null,
      meta: null,
    });
  });
});

describe("NodeCommandPalette", () => {
  it("should open the dialog when the button is clicked", () => {
    renderComponent();
    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("should filter options based on the search query", () => {
    renderComponent();
    const button = screen.getByRole("button");
    fireEvent.click(button);
    const searchInput = screen.getByPlaceholderText("Search...");

    fireEvent.change(searchInput, { target: { value: promoterCommandPaletteOptions[3].name } });

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText(promoterCommandPaletteOptions[3].name)).toBeInTheDocument();
    expect(within(dialog).queryByText(promoterCommandPaletteOptions[1].name)).toBeNull();
    expect(within(dialog).queryByText(promoterCommandPaletteOptions[2].name)).toBeNull();
  });

  it("should select an option when clicked", () => {
    renderComponent();
    const button = screen.getByRole("button");
    fireEvent.click(button);

    const dialog = screen.getByRole("dialog");
    const option2Button = within(dialog).getByText(promoterCommandPaletteOptions[2].name);
    fireEvent.click(option2Button);

    expect(button).toHaveTextContent(promoterCommandPaletteOptions[2].name);
  });
});
