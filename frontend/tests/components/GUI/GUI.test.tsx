import { GUI } from "@/components/GUI/GUI";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("GUI", () => {
  // Temporary test, will be unnecessary as development progresses.
  it("renders GUI section", () => {
    render(<GUI />);
    expect(screen.getByText("GUI Section")).toBeInTheDocument();
  });
});
