import { GITHUB_LIGHT_THEME, INDENT_SIZE } from "@/components/editor/constants";
import { useEditMode, useEditorRef, useMonacoRef, useValidationError } from "@/components/editor/editor-context";
import { EditorConsole } from "@/components/editor/error-console";
import { useReactflowToDsl } from "@/components/editor/hooks/use-circuit-to-dsl";
import { useDslToReactflow } from "@/components/editor/hooks/use-dsl-to-circuit";
import { useDslValidation } from "@/components/editor/hooks/use-dsl-validation";
import { EditorTopBar } from "@/components/editor/top-bar";
import { Separator } from "@/components/ui/separator";
import { Editor } from "@monaco-editor/react";
import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import React, { useState, useEffect } from "react";

export const CircuitEditor = () => {
  const [editorContent, setEditorContent] = useState<string>("");
  useDslValidation(editorContent);
  useDslToReactflow(editorContent);
  useReactflowToDsl(setEditorContent);

  const editorRef = useEditorRef();
  const monacoRef = useMonacoRef();
  const { validationError } = useValidationError();
  const { setEditMode } = useEditMode();

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

  const handleChanges = (editorContent: string) => {
    setEditMode("monaco-editor");
    setEditorContent(editorContent || "");
  };

  return (
    <div className="flex flex-col h-full w-full">
      <EditorTopBar editorContent={editorContent} setEditorContent={setEditorContent} />
      <Separator />
      {/*
        [Bug] automaticLayout doesnt shrink to container within flex layout
        https://github.com/microsoft/monaco-editor/issues/3393
      */}
      <div className="h-10 min-h-0 flex-1">
        <Editor
          defaultLanguage="yaml"
          value={editorContent}
          theme="github-light"
          onMount={handleEditorDidMount}
          onChange={handleChanges}
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
      <EditorConsole error={validationError} />
    </div>
  );
};
