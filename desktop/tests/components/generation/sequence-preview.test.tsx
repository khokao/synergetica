import { SequencePreview } from "@/components/generation/sequence-preview";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("SequencePreview Component", () => {
  it("renders ids and sequences", () => {
    // Arrange
    const chainSequences = {
      "parent-1": "AAATTT",
      "parent-2": "CCCGGG",
    };

    // Act
    render(<SequencePreview chainSequences={chainSequences} />);

    // Assert
    expect(screen.getByText("parent-1")).toBeInTheDocument();
    expect(screen.getByText("AAATTT")).toBeInTheDocument();

    expect(screen.getByText("parent-2")).toBeInTheDocument();
    expect(screen.getByText("CCCGGG")).toBeInTheDocument();
  });
});
