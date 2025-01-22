import { GITHUB_LIGHT_THEME, INDENT_SIZE } from "@/components/editor/constants";
import { useEditorContext } from "@/components/editor/editor-context";
import { EditorConsole } from "@/components/editor/error-console";
import { useSynchronizeDslWithReactFlow } from "@/components/editor/hooks/use-sync-dsl-with-flow";
import { EditorTopBar } from "@/components/editor/top-bar";
import { Separator } from "@/components/ui/separator";
import { Editor } from "@monaco-editor/react";
import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useEffect } from "react";

export const CircuitEditor = () => {
  const { editorRef, monacoRef, editorContent, setEditorContent, setEditMode } = useEditorContext();

  useSynchronizeDslWithReactFlow();

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

  const handleChange = (newEditorContent: string) => {
    setEditMode("monaco-editor");
    setEditorContent(newEditorContent || "");
  };

  return (
    <div className="flex flex-col h-full w-full" data-testid="circuit-editor">
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
