import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import React from "react";
import { ChildFooter } from "@/components/circuit/nodes/child-footer";


const deleteElementsMock = vi.fn();

vi.mock("@xyflow/react", () => {
  return {
    useReactFlow: () => ({
      deleteElements: deleteElementsMock,
      getNodes: vi.fn(() => [{ id: "node-1" }, { id: "node-2" }]),
      getEdges: vi.fn(() => [{ id: "edge-1", source: "node-1", target: "node-2" }]),
    }),
  };
});

describe("ChildFooter Component", () => {
  it("should render the settings button", () => {
    // Act
    render(<ChildFooter id="node-1" />);

    // Assert
    expect(screen.getByLabelText("settings")).toBeInTheDocument();
  });

  it("should open the dropdown menu when settings button is clicked", async () => {
    // Arrange
    render(<ChildFooter id="node-1" />);

    // Act
    await userEvent.click(screen.getByLabelText("settings"));

    // Assert
    expect(screen.getByTestId("dropdownmenu-content")).toBeInTheDocument();
  });

  it("should call deleteElements when delete is clicked", async () => {
    // Arrange
    render(<ChildFooter id="node-1" />);

    // Act
    await userEvent.click(screen.getByLabelText("settings"));
    await userEvent.click(screen.getByText("Delete"));

    // Assert
    expect(deleteElementsMock).toHaveBeenCalled();
  });
});
