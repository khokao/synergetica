// @ts-nocheck
import { CustomParentNode } from "@/components/circuit/nodes/parent-node";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("CustomParentNode", () => {
  it("renders a Badge with the node id when showParentId is true", () => {
    // Arrange
    const props = {
      id: "test-id",
      data: { showParentId: true },
    };

    // Act
    render(<CustomParentNode {...props} />);

    // Assert
    expect(screen.getByText("test-id")).toBeInTheDocument();
  });

  it("does not render the Badge when showParentId is false", () => {
    // Arrange
    const props = {
      id: "test-id",
      data: { showParentId: false },
    };

    // Act
    render(<CustomParentNode {...props} />);

    // Assert
    expect(screen.queryByText("test-id")).not.toBeInTheDocument();
  });
});
