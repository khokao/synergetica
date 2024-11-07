import { useEditorRef, useMonacoRef, useValidationError } from "@/components/editor/editor-context";
import { EditorConsole } from "@/components/editor/error-console";
import { useYamlValidation } from "@/components/editor/hooks/use-yaml-validation";
import { circuitSchema } from "@/components/editor/schema";
import { EditorTopBar } from "@/components/editor/top-bar";
import { Separator } from "@/components/ui/separator";
import { Editor } from "@monaco-editor/react";
import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import React, { useEffect, useState } from "react";

export const CircuitEditor = () => {
  const [value, setValue] = useState<string>("");
  useYamlValidation(value, circuitSchema);

  const editorRef = useEditorRef();
  const monacoRef = useMonacoRef();
  const { validationError } = useValidationError();

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  console.log(validationError);

  return (
    <div className="flex flex-col h-full w-full">
      <EditorTopBar />
      <Separator />
      <div className="flex-grow">
        <Editor
          height="100%"
          defaultLanguage="yaml"
          value={value}
          onMount={handleEditorDidMount}
          onChange={(value) => setValue(value || "")}
          options={{
            automaticLayout: true,
            minimap: { enabled: false },
          }}
        />
      </div>
      <Separator />
      <EditorConsole error={validationError} />
    </div>
  );
};
