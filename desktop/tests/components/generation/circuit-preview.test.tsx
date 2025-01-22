import { PartsProvider } from "@/components/circuit/parts/parts-context";
import { EditorProvider } from "@/components/editor/editor-context";
import { CircuitPreview } from "@/components/generation/circuit-preview";
import { render, screen } from "@testing-library/react";
import { ReactFlowProvider } from "@xyflow/react";
import { describe, expect, it } from "vitest";

describe("CircuitPreview Component", () => {
  it("renders ReactFlow preview with parent id", () => {
    // Arrange
    const nodes = [
      { id: "parent-1", type: "parent", position: { x: 0, y: 0 }, data: { showParentId: false } },
      {
        id: "child-1",
        type: "child",
        position: { x: 0, y: 0 },
        data: { name: "Promoter A", category: "Promoter", sequence: "A" },
      },
    ];
    const edges = [];

    // Act
    render(
      <ReactFlowProvider>
        <EditorProvider>
          <PartsProvider>
            <CircuitPreview nodes={nodes} edges={edges} />
          </PartsProvider>
        </EditorProvider>
      </ReactFlowProvider>,
    );

    // Assert
    expect(screen.getByText("parent-1")).toBeInTheDocument();
  });
});
