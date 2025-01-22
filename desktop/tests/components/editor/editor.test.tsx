import { PartsProvider } from "@/components/circuit/parts/parts-context";
import { CircuitEditor } from "@/components/editor/editor";
import { EditorProvider } from "@/components/editor/editor-context";
import { render, screen } from "@testing-library/react";
import { ReactFlowProvider } from "@xyflow/react";
import { describe, expect, it } from "vitest";

describe("CircuitEditor", () => {
  it("should render the CircuitEditor component", () => {
    render(
      <ReactFlowProvider>
        <EditorProvider>
          <PartsProvider>
            <CircuitEditor />
          </PartsProvider>
        </EditorProvider>
      </ReactFlowProvider>,
    );

    expect(screen.getByTestId("circuit-editor")).toBeInTheDocument();
  });
});
