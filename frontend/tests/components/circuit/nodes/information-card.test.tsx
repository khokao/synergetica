import { InformationCard } from "@/components/circuit/nodes/information-card";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/circuit/nodes/constants", () => ({
  PARTS_ID2NAME: {
    "part-1": "Part 1 Name",
    "part-2": "Part 2 Name",
    "part-3": "Part 3 Name",
  },
  PARTS_NAME2CATEGORY: {
    "Part 1 Name": "protein",
    "Part 2 Name": "promoter",
    "Part 3 Name": "promoter",
  },
}));

describe("InformationCard", () => {
  it("renders the nodePartsName and description", () => {
    // Arrange
    const data = {
      nodePartsName: "Test Name",
      description: "This is a test description",
      nodeCategory: "promoter",
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
      nodePartsName: "Test Name",
      description: "This is a test description",
      nodeCategory: "protein",
      partsId: "part-1",
      controlBy: [{ partsId: "part-2", controlType: "Repression" }],
      controlTo: [{ partsId: "part-3", controlType: "Activation" }],
    };

    // Act
    render(<InformationCard data={data} />);

    // Assert
    expect(screen.getByText("Part 2 Name")).toBeInTheDocument();
    expect(screen.getByText("Part 3 Name")).toBeInTheDocument();
  });
});
