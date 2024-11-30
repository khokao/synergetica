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
    const textElement = screen.getByText("Promoter");
    expect(textElement).toBeInTheDocument();
    expect(textElement.parentElement).toHaveClass("bg-blue-200");
    expect(screen.getByTestId("promoter-icon")).toBeInTheDocument();
  });

  it("displays the correct text and styles for protein category", () => {
    // Arrange
    const data = { category: "Protein" };

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
    const data = { category: "Terminator" };

    // Act
    render(<ChildHeader data={data} />);

    // Assert
    const textElement = screen.getByText("Terminator");
    expect(textElement).toBeInTheDocument();
    expect(textElement.parentElement).toHaveClass("bg-red-200");
    expect(screen.getByTestId("terminator-icon")).toBeInTheDocument();
  });
});
