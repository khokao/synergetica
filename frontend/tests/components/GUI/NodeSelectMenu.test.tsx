import { NodeSelectMenu } from "@/components/GUI/NodeSelectMenu";
import { fireEvent, render, screen } from "@testing-library/react";
import { useReactFlow } from "reactflow";
import { type Mock, describe, expect, it, vi } from "vitest";

vi.mock("reactflow", () => ({
  useReactFlow: vi.fn(),
}));

vi.stubGlobal(
  "ResizeObserver",
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
);

describe("NodeSelectMenu Component", () => {
  const options = [
    { name: "Option 1", description: "Description 1" },
    { name: "Option 2", description: "Description 2" },
  ];
  const id = "node-1";

  it("renders correctly with initial selected option", () => {
    render(<NodeSelectMenu options={options} id={id} />);

    expect(screen.getByText(options[0].name)).toBeInTheDocument();
  });

  it("opens the options list when the button is clicked", () => {
    render(<NodeSelectMenu options={options} id={id} />);

    fireEvent.click(screen.getByRole("button"));

    const listboxOptions = screen.getAllByRole("option");
    expect(listboxOptions).toHaveLength(options.length);
    for (let index = 0; index < options.length; index++) {
      expect(listboxOptions[index]).toHaveTextContent(options[index].name);
    }
  });

  it("calls onOptionSelect and updates the selected option when an option is clicked", () => {
    // Arrange
    const setNodesMock = vi.fn();
    const reactFlowMock = {
      setNodes: setNodesMock,
    };
    (useReactFlow as Mock).mockReturnValue(reactFlowMock);

    render(<NodeSelectMenu options={options} id={id} />);

    fireEvent.click(screen.getByRole("button"));
    const optionToSelect = options[1];

    // Act
    const listboxOptions = screen.getAllByRole("option");
    fireEvent.click(listboxOptions[1]);

    // Assert
    expect(screen.getByText(optionToSelect.name)).toBeInTheDocument();
    expect(setNodesMock).toHaveBeenCalledWith(expect.any(Function));
  });
});
