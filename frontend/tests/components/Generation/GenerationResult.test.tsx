import { GenerationResult } from "@/components/Generation/GenerationResult";
import type { GeneratorResponseData } from "@/interfaces/generatorAPI";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ReactFlowProvider } from "reactflow";
import { beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  Object.assign(navigator, {
    clipboard: {
      writeText: vi.fn().mockResolvedValue(undefined),
    },
  });
});

const mockData: GeneratorResponseData = {
  parent2child_details: {
    group1: [
      { nodeCategory: "category1", sequence: "sequence1" },
      { nodeCategory: "category2", sequence: "sequence2" },
    ],
    group2: [{ nodeCategory: "category3", sequence: "sequence3" }],
  },
};

const mockReactFlowNodes = [
  { id: "1", type: "input", data: { label: "Node 1" }, position: { x: 0, y: 0 } },
  { id: "2", type: "default", data: { label: "Node 2" }, position: { x: 100, y: 100 } },
];

const renderComponent = (isOpen: boolean, data?: GeneratorResponseData) => {
  const setIsOpen = vi.fn();

  return render(
    <ReactFlowProvider>
      <GenerationResult
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        reactFlowNodes={mockReactFlowNodes}
        reactFlowEdges={[]}
        data={data}
      />
    </ReactFlowProvider>,
  );
};

describe("GenerationResult", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the dialog when isOpen is true", async () => {
    await act(async () => {
      renderComponent(true, mockData);
    });

    expect(screen.getByText("Generation Result")).toBeInTheDocument();
  });

  it("does not render the dialog when isOpen is false", () => {
    renderComponent(false);

    expect(screen.queryByText("Generation Result")).not.toBeInTheDocument();
  });

  it("displays the correct react flow nodes and edges", async () => {
    await act(async () => {
      renderComponent(true, mockData);
    });

    expect(screen.getByText("Node 1")).toBeInTheDocument();
    expect(screen.getByText("Node 2")).toBeInTheDocument();
  });

  it("displays the generated sequences correctly", async () => {
    await act(async () => {
      renderComponent(true, mockData);
    });

    expect(screen.getByText("group1")).toBeInTheDocument();
    expect(screen.getByText("sequence1sequence2")).toBeInTheDocument();

    expect(screen.getByText("group2")).toBeInTheDocument();
    expect(screen.getByText("sequence3")).toBeInTheDocument();
  });

  it("handles copy to clipboard functionality", async () => {
    await act(async () => {
      renderComponent(true, mockData);
    });

    const copyButton = screen.getAllByTestId("copy-button")[0];
    await act(async () => {
      fireEvent.click(copyButton);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("sequence1sequence2");

    await waitFor(() => expect(screen.getByTestId("check-icon")).toBeInTheDocument());
  });

  it("calls setIsOpen when close button is clicked", async () => {
    const setIsOpenMock = vi.fn();
    await act(async () => {
      render(
        <ReactFlowProvider>
          <GenerationResult
            isOpen={true}
            setIsOpen={setIsOpenMock}
            reactFlowNodes={mockReactFlowNodes}
            reactFlowEdges={[]}
            data={mockData}
          />
        </ReactFlowProvider>,
      );
    });

    const closeButton = screen.getByRole("button", { name: /Close/i });
    await act(async () => {
      fireEvent.click(closeButton);
    });

    expect(setIsOpenMock).toHaveBeenCalledWith(false);
  });
});
