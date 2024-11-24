import { InformationCard } from "@/components/circuit/nodes/information-card";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/circuit/parts/constants", () => ({
  ALL_PARTS: {
    "Part 1 Name": { name: "Part 1 Name", description: "Part 1 Description", category: "protein" },
    "Part 2 Name": { name: "Part 2 Name", description: "Part 2 Description", category: "promoter" },
    "Part 3 Name": { name: "Part 3 Name", description: "Part 3 Description", category: "promoter" },
  },
}));

describe("InformationCard", () => {
  it("renders the nodePartsName and description", () => {
    // Arrange
    const data = {
      name: "Test Name",
      description: "This is a test description",
      category: "promoter",
      controlBy: [],
      controlTo: [],
    };

    // Act
    render(<InformationCard data={data} />);

    // Assert
    expect(screen.getByText("Test Name")).toBeInTheDocument();
    expect(screen.getByText("This is a test description")).toBeInTheDocument();
  });

  it("renders control buttons with correct parts names and icons", () => {
    // Arrange
    const data = {
      name: "Part 1 Name",
      description: "This is a test description",
      category: "protein",
      controlBy: [{ name: "Part 2 Name", type: "repression" }],
      controlTo: [{ name: "Part 3 Name", type: "activation" }],
    };

    // Act
    render(<InformationCard data={data} />);

    // Assert
    expect(screen.getByText("Part 2 Name")).toBeInTheDocument();
    expect(screen.getByText("Part 3 Name")).toBeInTheDocument();
  });
});
