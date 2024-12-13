import { SequencePreview } from "@/components/generation/sequence-preview";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("SequencePreview Component", () => {
  it("renders the concatenated sequences for each sequence ID", () => {
    // Arrange
    const mockData = {
      parent2child_details: {
        group1: [{ sequence: "AAA" }, { sequence: "TTT" }],
        group2: [{ sequence: "CCC" }, { sequence: "GGG" }],
      },
    };

    // Act
    render(<SequencePreview data={mockData} />);

    // Assert
    expect(screen.getByText("group1")).toBeInTheDocument();
    expect(screen.getByText("AAATTT")).toBeInTheDocument();

    expect(screen.getByText("group2")).toBeInTheDocument();
    expect(screen.getByText("CCCGGG")).toBeInTheDocument();
  });
});
