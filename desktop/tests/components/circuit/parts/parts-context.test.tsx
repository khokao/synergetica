import { PartsProvider, useParts } from "@/components/circuit/parts/parts-context";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@xyflow/react", () => ({
  useReactFlow: () => ({
    getNodes: vi.fn().mockReturnValue([]),
    setNodes: vi.fn(),
  }),
}));

const NEW_PROMOTER = {
  name: "PromoterA",
  description: "PromoterA part",
  category: "Promoter" as const,
  sequence: "ATGC",
  controlBy: [],
  params: {
    Ydef: 1.0,
  },
};

const EDITED_NEW_PROMOTER = {
  name: "PromoterA",
  description: "Edited PromoterA part",
  category: "Promoter" as const,
  sequence: "AAAA",
  controlBy: [],
  params: {
    Ydef: 100.0,
  },
};

const TestComponent = () => {
  const { parts, addPart, editPart, deletePart, promoterParts, proteinParts, terminatorParts } = useParts();

  return (
    <div>
      <div data-testid="parts">{JSON.stringify(parts)}</div>
      <button type="button" onClick={() => addPart(NEW_PROMOTER)}>
        Add Part
      </button>

      <div data-testid="promoterParts">{JSON.stringify(promoterParts)}</div>
      <div data-testid="proteinParts">{JSON.stringify(proteinParts)}</div>
      <div data-testid="terminatorParts">{JSON.stringify(terminatorParts)}</div>

      <button type="button" onClick={() => editPart(NEW_PROMOTER.name, EDITED_NEW_PROMOTER)}>
        Edit Part
      </button>

      <button type="button" onClick={() => deletePart(NEW_PROMOTER.name)}>
        Delete Part
      </button>
    </div>
  );
};

const getParts = () => {
  const textContent = screen.getByTestId("parts").textContent;
  return JSON.parse(textContent || "{}");
};

describe("PartsProvider", () => {
  it("should add a new part successfully", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <PartsProvider>
        <TestComponent />
      </PartsProvider>,
    );

    // Act
    await user.click(screen.getByText("Add Part"));

    // Assert
    expect(getParts()).toHaveProperty(NEW_PROMOTER.name);
  });

  it("should edit an existing part successfully", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <PartsProvider>
        <TestComponent />
      </PartsProvider>,
    );

    await user.click(screen.getByText("Add Part"));

    // Act
    await user.click(screen.getByText("Edit Part"));

    // Assert
    expect(getParts().PromoterA.sequence).toEqual(EDITED_NEW_PROMOTER.sequence);
    expect(getParts().PromoterA.params).toEqual(EDITED_NEW_PROMOTER.params);
  });

  it("should delete an existing part successfully", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <PartsProvider>
        <TestComponent />
      </PartsProvider>,
    );

    await user.click(screen.getByText("Add Part"));

    // Act
    await user.click(screen.getByText("Delete Part"));

    // Assert
    expect(getParts()).not.toHaveProperty(NEW_PROMOTER.name);
  });
});
