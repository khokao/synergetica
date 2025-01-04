import { PartsProvider } from "@/components/circuit/parts/parts-context";
import { GenerationResultDialog } from "@/components/generation/result-dialog";
import { render, screen } from "@testing-library/react";
import { ReactFlowProvider } from "@xyflow/react";
import React from "react";
import { describe, expect, it } from "vitest";

const generationResult = {
  snapshot: {
    nodes: [
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
        data: { name: "Terminator A", category: "Terminator", sequence: "CG" },
      },
    ],
    edges: [
      { id: "edge-1", source: "child-1", target: "child-2" },
      { id: "edge-2", source: "child-2", target: "child-3" },
    ],
    proteinParameters: {
      "child-2": 10,
    },
  },
  chainSequences: {
    "parent-1": "ATCG",
  },
};

describe("GenerationResultModal Component", () => {
  it("renders the modal content when isOpen is true", () => {
    // Arrange
    const isOpen = true;
    const setIsOpen = vi.fn();

    // Act
    render(
      <ReactFlowProvider>
        <PartsProvider>
          <GenerationResultDialog generationResult={generationResult} isOpen={isOpen} setIsOpen={setIsOpen} />
        </PartsProvider>
      </ReactFlowProvider>,
    );

    // Assert
    expect(screen.getByTestId("generation-result-dialog")).toBeInTheDocument();
  });

  it("does not render the modal content when isOpen is false", () => {
    // Arrange
    const isOpen = false;
    const setIsOpen = vi.fn();

    // Act
    render(
      <ReactFlowProvider>
        <PartsProvider>
          <GenerationResultDialog generationResult={generationResult} isOpen={isOpen} setIsOpen={setIsOpen} />
        </PartsProvider>
      </ReactFlowProvider>,
    );

    // Assert
    expect(screen.queryByTestId("generation-result-dialog")).not.toBeInTheDocument();
  });
});
