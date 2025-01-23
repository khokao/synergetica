import { useSynchronizeDslWithReactFlow } from "@/components/editor/dsl/use-sync-dsl-with-flow";
import { useEditorContext } from "@/components/editor/editor-context";
import { renderHook } from "@testing-library/react";
import { useReactFlow } from "@xyflow/react";
import type { ReactFlowInstance } from "@xyflow/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

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
    }),
  };
});

vi.mock("@/components/editor/editor-context", () => ({
  useEditorContext: vi.fn(),
}));

vi.mock("@xyflow/react", () => ({
  useReactFlow: vi.fn(),
  useNodes: vi.fn().mockReturnValue([
    { id: "parent-1", type: "parent", position: { x: 0, y: 0 }, data: {} },
    {
      id: "child-1",
      type: "child",
      position: { x: 20, y: 20 },
      parentId: "parent-1",
      data: { name: "PromoterA", category: "Promoter" },
    },
    {
      id: "child-2",
      type: "child",
      position: { x: 250, y: 0 },
      parentId: "parent-1",
      data: { name: "ProteinA", category: "Protein" },
    },
    {
      id: "child-3",
      type: "child",
      position: { x: 480, y: 0 },
      parentId: "parent-1",
      data: { name: "TerminatorA", category: "Terminator" },
    },
  ]),
}));

describe("useSynchronizeDslWithReactFlow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const editorContent = `- chain:
  - type: Promoter
    name: PromoterA
  - type: Protein
    name: ProteinA
  - type: Terminator
    name: TerminatorA
`;

  it("calls ReactFlow => YAML process", () => {
    // Arrange
    const setEditorContentMock = vi.fn();
    const setValidationErrorMock = vi.fn();
    const setNodesMock = vi.fn();
    const setEdgesMock = vi.fn();

    vi.mocked(useEditorContext).mockReturnValue({
      // @ts-ignore
      editorRef: { current: { getModel: vi.fn() } },
      // @ts-ignore
      monacoRef: { current: { editor: { setModelMarkers: vi.fn() } } },
      editorContent: "",
      setEditorContent: setEditorContentMock,
      setValidationError: setValidationErrorMock,
      editMode: "reactflow",
    });

    vi.mocked(useReactFlow).mockReturnValue({
      setNodes: setNodesMock,
      setEdges: setEdgesMock,
    } as unknown as ReactFlowInstance);

    // Act
    renderHook(() => useSynchronizeDslWithReactFlow());

    // Assert
    expect(setEditorContentMock).toHaveBeenCalledWith(editorContent);
    expect(setValidationErrorMock).toHaveBeenCalledWith([]);
    expect(setNodesMock).not.toHaveBeenCalled();
    expect(setEdgesMock).not.toHaveBeenCalled();
  });

  it("calls YAML => ReactFlow process", () => {
    // Arrange
    const setEditorContentMock = vi.fn();
    const setValidationErrorMock = vi.fn();
    const setNodesMock = vi.fn();
    const setEdgesMock = vi.fn();

    vi.mocked(useEditorContext).mockReturnValue({
      // @ts-ignore
      editorRef: { current: { getModel: vi.fn() } },
      // @ts-ignore
      monacoRef: { current: { editor: { setModelMarkers: vi.fn() } } },
      editorContent: editorContent,
      setEditorContent: setEditorContentMock,
      setValidationError: setValidationErrorMock,
      editMode: "monaco-editor",
    });

    vi.mocked(useReactFlow).mockReturnValue({
      setNodes: setNodesMock,
      setEdges: setEdgesMock,
    } as unknown as ReactFlowInstance);

    // Act
    renderHook(() => useSynchronizeDslWithReactFlow());

    // Assert
    expect(setEditorContentMock).not.toHaveBeenCalled();
    expect(setValidationErrorMock).toHaveBeenCalledWith([]);
    expect(setNodesMock.mock.calls[0][0]).toHaveLength(4); // 1 parent and 3 children
    expect(setEdgesMock.mock.calls[0][0]).toHaveLength(2); // 2 edges in total
  });
});
