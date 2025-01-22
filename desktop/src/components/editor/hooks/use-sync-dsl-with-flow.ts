import { useParts } from "@/components/circuit/parts/parts-context";
import { dslToReactflow } from "@/components/editor/convert/dsl-to-reactflow";
import { reactflowToDsl } from "@/components/editor/convert/reactflow-to-dsl";
import { useEditorContext } from "@/components/editor/editor-context";
import { useStrictSchema } from "@/components/editor/schemas/strict-schema";
import { validateContent } from "@/components/editor/validate/validate-content";
import { useNodes, useReactFlow } from "@xyflow/react";
import { useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";

export const useSynchronizeDslWithReactFlow = () => {
  const { editorRef, monacoRef, editorContent, setEditorContent, setValidationError, editMode } = useEditorContext();
  const { parts } = useParts();
  const { strictCircuitSchema } = useStrictSchema();
  const { setNodes, setEdges } = useReactFlow();
  const nodes = useNodes();
  const [debouncedNodes] = useDebounce(nodes, 500);
  const prevParsedContentRef = useRef<string>("");

  //  ReactFlow => YAML
  useEffect(() => {
    if (editMode !== "reactflow") return;

    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;

    const dslContent = reactflowToDsl(debouncedNodes);
    const { validationErrors, markers, parsedContent } = validateContent(dslContent, strictCircuitSchema);

    // skip if the parsed content is the same as the previous one
    const newParsedContent = JSON.stringify(parsedContent);
    if (prevParsedContentRef.current === newParsedContent) return;
    prevParsedContentRef.current = newParsedContent;

    setEditorContent(dslContent);
    setValidationError(validationErrors);

    const model = editor.getModel();
    if (model) {
      monaco.editor.setModelMarkers(model, "owner", markers);
    }
  }, [editMode, debouncedNodes, editorRef, monacoRef, setEditorContent, setValidationError, strictCircuitSchema]);

  // YAML => ReactFlow
  useEffect(() => {
    if (editMode !== "monaco-editor") return;

    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;

    const { validationErrors, markers, parsedContent } = validateContent(editorContent, strictCircuitSchema);

    // skip if the parsed content is the same as the previous one
    const newParsedContent = JSON.stringify(parsedContent);
    if (prevParsedContentRef.current === newParsedContent) return;
    prevParsedContentRef.current = newParsedContent;

    setValidationError(validationErrors);
    const model = editor.getModel();
    if (model) {
      monaco.editor.setModelMarkers(model, "owner", markers);
    }

    const reactFlowData = dslToReactflow(editorContent, parts);
    if (reactFlowData) {
      setNodes(reactFlowData.nodes);
      setEdges(reactFlowData.edges);
    }
  }, [
    editMode,
    editorContent,
    editorRef,
    monacoRef,
    strictCircuitSchema,
    setValidationError,
    setNodes,
    setEdges,
    parts,
  ]);
};
