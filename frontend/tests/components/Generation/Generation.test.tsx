import { Generation } from "@/components/Generation/Generation";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/context/GeneratorResponseContext", () => ({
  useResponse: vi.fn().mockReturnValue({
    response: {
      rbs_sequence: "ATGCATGCATGC",
      promoter_sequence: "ATGCAATTGGCC",
    },
  }),
}));

describe("Generation Component", () => {
  afterEach(() => {
    cleanup();
  });

  // Temporary test, will be unnecessary as development progresses.
  it("renders the Generation section", () => {
    render(<Generation />);
    expect(screen.getByText("Generation Section")).toBeInTheDocument();
  });

  it("displays response data correctly", () => {
    render(<Generation />);
    expect(screen.getByText('RBS: "ATGCATGCATGC"')).toBeInTheDocument();
    expect(screen.getByText('Promoter: "ATGCAATTGGCC"')).toBeInTheDocument();
  });
});
