import { FileSidebar } from "@/components/FileSidebar/FileSidebar";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("FileSidebar", () => {
  // Temporary test, will be unnecessary as development progresses.
  it("renders FileSidebar section", () => {
    render(<FileSidebar />);
    expect(screen.getByText("FileSidebar Section")).toBeInTheDocument();
  });
});
