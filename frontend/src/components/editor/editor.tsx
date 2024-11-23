import { GITHUB_LIGHT_THEME, INDENT_SIZE } from "@/components/editor/constants";
import { useEditorContext } from "@/components/editor/editor-context";
import { EditorConsole } from "@/components/editor/error-console";
import { EditorTopBar } from "@/components/editor/top-bar";
import { dslToReactflow } from "@/components/editor/utils/dsl-to-reactflow";
import { validateDslContent } from "@/components/editor/utils/dsl-validation";
import { convertReactFlowNodesToDSL } from "@/components/editor/utils/reactflow-to-dsl";
import { Separator } from "@/components/ui/separator";
import { Editor } from "@monaco-editor/react";
import type { Monaco } from "@monaco-editor/react";
import { useNodes, useReactFlow } from "@xyflow/react";
import type { editor } from "monaco-editor";
import React, { useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";

export const CircuitEditor = () => {
  const { editorRef, monacoRef, editorContent, setEditorContent, setEditMode, setValidationError, editMode } =
    useEditorContext();
  const { setNodes, setEdges } = useReactFlow();
  const nodes = useNodes();
  const [debouncedNodes] = useDebounce(nodes, 500);
  const prevParsedContentRef = useRef<string>("");

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    monaco.editor.defineTheme("github-light", GITHUB_LIGHT_THEME);
    monaco.editor.setTheme("github-light");
  };
  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor.defineTheme("github-light", GITHUB_LIGHT_THEME);
      monacoRef.current.editor.setTheme("github-light");
    }
  }, [monacoRef]);

  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;

    if (editMode !== "reactflow" || !editor || !monaco) {
      return;
    }

    const dslContent = convertReactFlowNodesToDSL(debouncedNodes);
    const { validationErrors, markers, parsedContent } = validateDslContent(dslContent);

    const newParsedContent = JSON.stringify(parsedContent);
    const prevParsedContent = prevParsedContentRef.current;
    if (prevParsedContent === newParsedContent) {
      return;
    }
    prevParsedContentRef.current = newParsedContent;

    setEditorContent(dslContent);
    setValidationError(validationErrors);

    const model = editor.getModel();
    model && monaco.editor.setModelMarkers(model, "owner", markers);
  }, [debouncedNodes, setEditorContent, setValidationError, editMode, editorRef, monacoRef]);

  const handleChange = (newEditorContent: string) => {
    setEditMode("monaco-editor");
    setEditorContent(newEditorContent || "");
  };

  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;

    if (editMode !== "monaco-editor" || !editor || !monaco) {
      return;
    }

    const { validationErrors, markers, parsedContent } = validateDslContent(editorContent);

    const newParsedContent = JSON.stringify(parsedContent);
    const prevParsedContent = prevParsedContentRef.current;
    if (prevParsedContent === newParsedContent) {
      return;
    }
    prevParsedContentRef.current = newParsedContent;

    setValidationError(validationErrors);

    const model = editor.getModel();
    model && monaco.editor.setModelMarkers(model, "owner", markers);

    const reactFlowData = dslToReactflow(editorContent);
    if (reactFlowData) {
      const { nodes, edges } = reactFlowData;
      setNodes(nodes);
      setEdges(edges);
    }
  }, [editorContent, editMode, setNodes, setEdges, setValidationError, editorRef, monacoRef]);

  return (
    <div className="flex flex-col h-full w-full">
      <EditorTopBar />
      <Separator />
      <div className="h-10 min-h-0 flex-1">
        <Editor
          defaultLanguage="yaml"
          value={editorContent}
          theme="github-light"
          onMount={handleEditorDidMount}
          onChange={handleChange}
          options={{
            automaticLayout: true,
            tabSize: INDENT_SIZE,
            minimap: { enabled: false },
            scrollbar: { verticalScrollbarSize: 8, horizontal: "hidden" },
            padding: { top: 10 },
          }}
        />
      </div>
      <Separator />
      <EditorConsole />
    </div>
  );
};
