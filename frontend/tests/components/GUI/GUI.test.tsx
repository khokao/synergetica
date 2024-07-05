import { GUI } from "@/components/GUI/GUI";
import { render, screen } from "@testing-library/react";
import React from "react";
import { ReactFlowProvider } from "reactflow";
import { describe, expect, it, vi } from "vitest";


// Required to temporarily render the GUI section during testing.
vi.stubGlobal(
  "ResizeObserver",
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
);

describe("GUI Component", () => {
  it("renders GUI component correctly", () => {
    render(
      <ReactFlowProvider>
        <GUI />
      </ReactFlowProvider>,
    );

    const flowComponent = screen.getByTestId("flow-component");
    const bottombarComponent = screen.getByTestId("bottombar-component");

    expect(flowComponent).toBeInTheDocument();
    expect(bottombarComponent).toBeInTheDocument();
  });
});
