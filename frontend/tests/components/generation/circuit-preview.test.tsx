import { CircuitPreview } from "@/components/generation/circuit-preview";
import { render, screen } from "@testing-library/react";
import type { Edge, Node } from "@xyflow/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@xyflow/react", () => ({
  ReactFlow: ({ children }: { children: React.ReactNode }) => <div data-testid="react-flow">{children}</div>,
  ReactFlowProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Background: vi.fn(),
  BackgroundVariant: vi.fn(),
}));

describe("CircuitPreview Component", () => {
  it("renders nothing when snapshot is null", () => {
    // Arrange
    const snapshot = null;

    // Act
    const { container } = render(<CircuitPreview snapshot={snapshot} />);

    // Assert
    expect(container).toBeEmptyDOMElement();
  });

  it("renders ReactFlow with modified nodes when snapshot is provided", () => {
    // Arrange
    const snapshot = {
      nodes: [
        { id: "1", type: "parent", data: {} },
        { id: "2", type: "child", data: {} },
      ] as Node[],
      edges: [{ id: "e1-2", source: "1", target: "2" }] as Edge[],
      proteinParameter: { foo: 10 },
    };

    // Act
    render(<CircuitPreview snapshot={snapshot} />);

    // Assert
    expect(screen.getByTestId("react-flow")).toBeInTheDocument();
  });
});
