import { NodeCommandPalette, updateNodeMetadata } from "@/components/GUI/NodeCommandPalette";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { ReactFlowProvider } from "reactflow";
import { describe, expect, it } from "vitest";

const options = [
  { name: "Option1", description: "Description1", subcategory: "Category1", repressedBy: "None", repressTo: "None" },
  { name: "Option2", description: "Description2", subcategory: "Category1", repressedBy: "None", repressTo: "None" },
  { name: "Option3", description: "Description3", subcategory: "Category2", repressedBy: "None", repressTo: "None" },
];
const nodeId = "test-node-id";

const renderComponent = () => {
  return render(
    <ReactFlowProvider>
      <NodeCommandPalette options={options} id={nodeId} />
    </ReactFlowProvider>,
  );
};

describe("updateNodeMetadata", () => {
  it("should update the node metadata correctly", () => {
    const nodes = [
      {
        id: nodeId,
        position: { x: 0, y: 0 },
        data: { nodeSubcategory: "", nodePartsName: "", repressedBy: "", repressTo: "" },
      },
    ];
    const option = {
      subcategory: "newCategory",
      name: "newName",
      repressedBy: "newRepressedBy",
      repressTo: "newRepressTo",
    };

    const updatedNodes = updateNodeMetadata(nodes, nodeId, option);

    expect(updatedNodes[0].data).toEqual({
      nodeSubcategory: "newCategory",
      nodePartsName: "newName",
      repressedBy: "newRepressedBy",
      repressTo: "newRepressTo",
    });
  });
});

describe("NodeCommandPalette", () => {
  it("should display the selected option name", () => {
    renderComponent();

    expect(screen.getByText("Option1")).toBeInTheDocument();
  });

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

    fireEvent.change(searchInput, { target: { value: "Option3" } });

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Option3")).toBeInTheDocument();
    expect(within(dialog).queryByText("Option1")).toBeNull();
    expect(within(dialog).queryByText("Option2")).toBeNull();
  });

  it("should select an option when clicked", () => {
    renderComponent();
    const button = screen.getByRole("button");
    fireEvent.click(button);

    const dialog = screen.getByRole("dialog");
    const option2Button = within(dialog).getByText("Option2");
    fireEvent.click(option2Button);

    expect(button).toHaveTextContent("Option2");
  });
});
