import { InformationCard } from "@/components/circuit/nodes/information-card";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/circuit/parts/parts-context", () => {
  return {
    useParts: () => ({
      parts: {
        testPromoterName: {
          name: "testPromoterName",
          description: "Test Promoter Description",
          category: "Promoter",
          controlBy: [
            {
              name: "testProteinName",
              type: "Repression",
            },
            {
              name: "testProteinName2",
              type: "Activation",
            },
          ],
          controlTo: [],
        },
        testProteinName: {
          name: "testProteinName",
          description: "Test Protein Description",
          category: "Protein",
          controlBy: [],
          controlTo: [
            {
              name: "testPromoterName",
              type: "Repression",
            },
          ],
        },
        testProteinName2: {
          name: "testProteinName2",
          description: "Test Protein2 Description",
          category: "Protein",
          controlBy: [],
          controlTo: [
            {
              name: "testPromoterName",
              type: "Activation",
            },
          ],
        },
        testTerminatorName: {
          name: "testTerminatorName",
          description: "Test Terminator Description",
          category: "Terminator",
          controlBy: [],
          controlTo: [],
        },
      },
    }),
  };
});

describe("InformationCard", () => {
  it("renders the nodePartsName and description", () => {
    // Arrange
    const data = {
      name: "testPartName",
      description: "Test Part Description",
      category: "Promoter",
      controlBy: [],
      controlTo: [],
    };

    // Act
    render(<InformationCard data={data} />);

    // Assert
    expect(screen.getByText("testPartName")).toBeInTheDocument();
    expect(screen.getByText("Test Part Description")).toBeInTheDocument();
  });

  it("renders control buttons with correct parts names and icons", () => {
    // Arrange
    const data = {
      name: "testPromoterName",
      description: "Test Promoter Description",
      category: "Promoter",
      controlBy: [{ name: "testProteinName", type: "Repression" }],
      controlTo: [{ name: "testProteinName2", type: "Activation" }],
    };

    // Act
    render(<InformationCard data={data} />);

    // Assert
    expect(screen.getByText("testProteinName")).toBeInTheDocument();
    expect(screen.getByText("testProteinName2")).toBeInTheDocument();
  });
});
