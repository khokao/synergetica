import { Generation } from "@/components/Generation/Generation";
import { cleanup, render, screen } from "@testing-library/react";
import useSWR from "swr";
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("swr");

describe("Generation Component", () => {
  beforeEach(() => {
    (useSWR as Mock).mockReturnValue({
      data: {
        rbs_sequence: "ATGCATGCATGC",
        promoter_sequence: "ATGCAATTGGCC",
      },
    });
  });

  afterEach(() => {
    cleanup();
  });

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
