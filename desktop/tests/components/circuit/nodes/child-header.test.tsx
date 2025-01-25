import { ChildHeader } from "@/components/circuit/nodes/child-header";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("ChildHeader Component", () => {
  it("displays the correct text and styles for promoter category", () => {
    // Arrange
    const data = { category: "Promoter" };

    // Act
    render(<ChildHeader data={data} />);

    // Assert
    expect(screen.getByText("Promoter")).toBeInTheDocument();
    expect(screen.getByTestId("Promoter-icon")).toBeInTheDocument();
  });

  it("displays the correct text and styles for protein category", () => {
    // Arrange
    const data = { category: "Protein" };

    // Act
    render(<ChildHeader data={data} />);

    // Assert
    expect(screen.getByText("Protein")).toBeInTheDocument();
    expect(screen.getByTestId("Protein-icon")).toBeInTheDocument();
  });

  it("displays the correct text and styles for terminator category", () => {
    // Arrange
    const data = { category: "Terminator" };

    // Act
    render(<ChildHeader data={data} />);

    // Assert
    expect(screen.getByText("Terminator")).toBeInTheDocument();
    expect(screen.getByTestId("Terminator-icon")).toBeInTheDocument();
  });
});
