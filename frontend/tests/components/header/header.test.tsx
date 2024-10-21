import { Header } from "@/components/header/header";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Header Component", () => {
  it("renders header with Studio and Project navigation items", () => {
    // Arrange
    render(<Header />);

    // Act
    const studioNavItem = screen.getByText("Studio");
    const projectNavItem = screen.getByText("Project");

    // Assert
    expect(studioNavItem).toBeInTheDocument();
    expect(projectNavItem).toBeInTheDocument();
  });
});
