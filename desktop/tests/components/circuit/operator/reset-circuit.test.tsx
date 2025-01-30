import { ResetCircuit } from "@/components/circuit/operator/reset-circuit";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

const setNodesMock = vi.fn();
const setEdgesMock = vi.fn();
const setEditorContentMock = vi.fn();

vi.mock("@xyflow/react", () => {
  return {
    useReactFlow: () => ({
      setNodes: setNodesMock,
      setEdges: setEdgesMock,
    }),
  };
});

vi.mock("@/components/editor/editor-context", () => ({
  useEditorContext: () => ({
    setEditorContent: setEditorContentMock,
  }),
}));

describe("ResetCircuit Component", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("displays tooltip on hover over button", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<ResetCircuit />);

    // Act
    await user.hover(screen.getByTestId("reset-circuit-button"));

    // Assert
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent("Reset circuit");
    });
  });

  it("calls setNodes, setEdges, setEditorContent when the button is clicked.", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<ResetCircuit />);

    // Act
    await user.click(screen.getByTestId("reset-circuit-button"));

    // Assert
    expect(setNodesMock).toHaveBeenCalledWith([]);
    expect(setEdgesMock).toHaveBeenCalledWith([]);
    expect(setEditorContentMock).toHaveBeenCalledWith("");
  });
});
