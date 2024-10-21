import { render, screen } from "@testing-library/react";
import { ChildHeader } from "@/components/circuit/nodes/child-header";
import { describe, it, expect } from "vitest";


describe("ChildHeader Component", () => {
  it("displays the correct text and styles for promoter category", () => {
    // Arrange
    const data = { nodeCategory: "promoter" };

    // Act
    render(<ChildHeader data={data} />);

    // Assert
    const textElement = screen.getByText("Promoter");
    expect(textElement).toBeInTheDocument();
    expect(textElement.parentElement).toHaveClass("bg-blue-200");
    expect(screen.getByTestId("promoter-icon")).toBeInTheDocument();
  });

  it("displays the correct text and styles for protein category", () => {
    // Arrange
    const data = { nodeCategory: "protein" };

    // Act
    render(<ChildHeader data={data} />);

    // Assert
    const textElement = screen.getByText("Protein");
    expect(textElement).toBeInTheDocument();
    expect(textElement.parentElement).toHaveClass("bg-green-200");
    expect(screen.getByTestId("protein-icon")).toBeInTheDocument();
  });

  it("displays the correct text and styles for terminator category", () => {
    // Arrange
    const data = { nodeCategory: "terminator" };

    // Act
    render(<ChildHeader data={data} />);

    // Assert
    const textElement = screen.getByText("Terminator");
    expect(textElement).toBeInTheDocument();
    expect(textElement.parentElement).toHaveClass("bg-red-200");
    expect(screen.getByTestId("terminator-icon")).toBeInTheDocument();
  });
});
