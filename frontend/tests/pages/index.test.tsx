import Home from "@/pages/index";
import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/FileSidebar/FileSidebar", () => ({
  FileSidebar: () => <div>FileSidebar Section</div>,
}));

vi.mock("@/components/GUI/GUI", () => ({
  GUI: () => <div>GUI Section</div>,
}));

vi.mock("@/components/Simulation/Simulation", () => ({
  Simulation: () => <div>Simulation Section</div>,
}));

describe("Home Page", () => {
  it("renders FileSidebar component", () => {
    render(<Home />);
    expect(screen.getByText("FileSidebar Section")).toBeInTheDocument();
  });

  it("renders GUI component", () => {
    render(<Home />);
    expect(screen.getByText("GUI Section")).toBeInTheDocument();
  });

  it("renders Simulation component", () => {
    render(<Home />);
    expect(screen.getByText("Simulation Section")).toBeInTheDocument();
  });
});
