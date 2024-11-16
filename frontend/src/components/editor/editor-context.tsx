import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import type React from "react";
import { createContext, useContext, useRef, useState } from "react";

type ValidationError = { message: string; line: number };

type EditMode = "reactflow" | "monaco-editor";

type EditorContextType = {
  editorRef: React.MutableRefObject<editor.IStandaloneCodeEditor | null>;
  monacoRef: React.MutableRefObject<Monaco | null>;
  editorContent: string;
  setEditorContent: (content: string) => void;
  validationError: ValidationError[];
  setValidationError: (error: ValidationError[]) => void;
  editMode: EditMode;
  setEditMode: (mode: EditMode) => void;
};

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditorContext must be used within an EditorProvider");
  }
  return context;
};

export const EditorProvider = ({ children }: { children: React.ReactNode }) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const [editorContent, setEditorContent] = useState("");
  const [validationError, setValidationError] = useState<ValidationError[]>([]);
  const [editMode, setEditMode] = useState<EditMode>("reactflow");

  return (
    <EditorContext.Provider
      value={{
        editorRef,
        monacoRef,
        editorContent,
        setEditorContent,
        validationError,
        setValidationError,
        editMode,
        setEditMode,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};
