import { ParameterPreview } from "@/components/generation/parameter-preview";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("ParameterPreview Component", () => {
  it("renders protein sliders and parameters", () => {
    // Arrange
    const nodes = [
      { id: "parent-1", type: "parent", position: { x: 0, y: 0 }, data: { showParentId: false } },
      {
        id: "child-1",
        type: "child",
        position: { x: 0, y: 0 },
        data: { name: "Promoter A", category: "Promoter", sequence: "A" },
      },
      {
        id: "child-2",
        type: "child",
        position: { x: 0, y: 0 },
        data: { name: "Protein A", category: "Protein", sequence: "T" },
      },
      {
        id: "child-3",
        type: "child",
        position: { x: 0, y: 0 },
        data: { name: "Protein B", category: "Protein", sequence: "T" },
      },
      {
        id: "child-4",
        type: "child",
        position: { x: 0, y: 0 },
        data: { name: "Terminator A", category: "Terminator", sequence: "CG" },
      },
    ];
    const proteinParameters = {
      "child-2": 10,
      "child-3": 20,
    };

    // Act
    render(<ParameterPreview nodes={nodes} proteinParameters={proteinParameters} />);

    // Assert
    expect(screen.getByText("Protein A")).toBeInTheDocument();
    expect(screen.getByText("Protein B")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.queryByText("Promoter A")).not.toBeInTheDocument();
    expect(screen.queryByText("Terminator A")).not.toBeInTheDocument();
  });
});
