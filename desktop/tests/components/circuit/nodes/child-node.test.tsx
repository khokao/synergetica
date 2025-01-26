// @ts-nocheck
import { CustomChildNode } from "@/components/circuit/nodes/child-node";
import { EditorProvider } from "@/components/editor/editor-context";
import { render, screen } from "@testing-library/react";
import { ReactFlowProvider } from "@xyflow/react";
import { describe, expect, it } from "vitest";

vi.mock("@/components/circuit/parts/parts-context", () => {
  const PromoterA = {
    name: "PromoterA",
    description: "PromoterA Description",
    category: "Promoter",
    controlBy: [
      {
        name: "ProteinA",
        type: "Repression",
      },
    ],
    controlTo: [],
  };
  const ProteinA = {
    name: "ProteinA",
    description: "Test Protein Description",
    category: "Protein",
    controlBy: [],
    controlTo: [
      {
        name: "PromoterA",
        type: "Repression",
      },
    ],
  };
  const TerminatorA = {
    name: "TerminatorA",
    description: "Test Terminator Description",
    category: "Terminator",
    controlBy: [],
    controlTo: [],
  };

  return {
    useParts: vi.fn().mockReturnValue({
      parts: {
        PromoterA: PromoterA,
        ProteinA: ProteinA,
        TerminatorA: TerminatorA,
      },
      promoterParts: { PromoterA },
      proteinParts: { ProteinA },
      terminatorParts: { TerminatorA },
      interactionStore: {
        getProteinsByPromoter: vi.fn(() => [{ from: "ProteinA", to: "PromoterA", type: "Repression" }]),
        getPromotersByProtein: vi.fn(() => [{ from: "ProteinA", to: "PromoterA", type: "Repression" }]),
      },
    }),
  };
});

describe("CustomChildNode", () => {
  it("renders the custom node", () => {
    // Arrange & Act
    render(
      <ReactFlowProvider>
        <EditorProvider>
          <CustomChildNode
            id="test-id"
            selected={false}
            data={{
              name: "PromoterA",
              description: "PromoterA Description",
              category: "Promoter",
              simulationTargetHighlight: false,
              leftHandleConnected: false,
              rightHandleConnected: false,
            }}
          />
        </EditorProvider>
      </ReactFlowProvider>,
    );

    // Assert
    expect(screen.getByTestId("custom-node")).toBeInTheDocument();
  });
});
