import { ChildSelectModal } from "@/components/circuit/nodes/child-select-modal";
import { EditorProvider } from "@/components/editor/editor-context";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

describe("ChildSelectModal", () => {
  const renderComponent = () => {
    render(
      <ReactFlowProvider>
        <EditorProvider>
          <ChildSelectModal
            id="test-id"
            data={{ name: "PromoterA", description: "PromoterA Description", category: "Promoter" }}
          />
        </EditorProvider>
      </ReactFlowProvider>,
    );
  };

  it("renders the SelectMenu and CircuitPreview", async () => {
    // Arrange
    const user = userEvent.setup();
    renderComponent();

    // Act
    await user.click(screen.getByTestId("select-modal-button"));

    // Assert
    expect(screen.getByTestId("select-menu")).toBeInTheDocument();
    expect(screen.getByTestId("select-modal-preview-flow")).toBeInTheDocument();
  });

  it("fires the click event and closes the modal", async () => {
    // Arrange
    renderComponent();
    const user = userEvent.setup();

    // Act
    await user.click(screen.getByTestId("select-modal-button"));
    await user.click(screen.getByText("PromoterA Description"));

    // Assert
    expect(screen.queryByTestId("select-menu")).not.toBeInTheDocument();
  });
});
