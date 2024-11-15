import { githubLightTheme } from "@/components/editor/constants";
import { useChangeSource, useEditorRef, useMonacoRef, useValidationError } from "@/components/editor/editor-context";
import { EditorConsole } from "@/components/editor/error-console";
import { useCircuitToDsl } from "@/components/editor/hooks/use-circuit-to-dsl";
import { useDslToCircuit } from "@/components/editor/hooks/use-dsl-to-circuit";
import { useDslValidation } from "@/components/editor/hooks/use-dsl-validation";
import { EditorTopBar } from "@/components/editor/top-bar";
import { Separator } from "@/components/ui/separator";
import { Editor } from "@monaco-editor/react";
import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import React, { useState, useEffect } from "react";

export const CircuitEditor = () => {
  const [value, setValue] = useState<string>("");
  useDslValidation(value);
  useDslToCircuit(value);
  useCircuitToDsl(setValue);

  const editorRef = useEditorRef();
  const monacoRef = useMonacoRef();
  const { validationError } = useValidationError();
  const { setChangeSource } = useChangeSource();

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    monaco.editor.defineTheme("github-light", githubLightTheme);
    monaco.editor.setTheme("github-light");
  };

  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor.defineTheme("github-light", githubLightTheme);
      monacoRef.current.editor.setTheme("github-light");
    }
  }, [monacoRef]);

  const handleChanges = (value: string) => {
    setChangeSource("dsl");
    setValue(value || "");
  };

  return (
    <div className="flex flex-col h-full w-full">
      <EditorTopBar />
      <Separator />
      {/*
        [Bug] automaticLayout doesnt shrink to container within flex layout
        https://github.com/microsoft/monaco-editor/issues/3393
      */}
      <div className="h-10 min-h-0 flex-1">
        <Editor
          defaultLanguage="yaml"
          value={value}
          theme="github-light"
          onMount={handleEditorDidMount}
          onChange={handleChanges}
          options={{
            automaticLayout: true,
            tabSize: 2,
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
