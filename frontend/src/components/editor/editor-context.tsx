import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import type React from "react";
import { createContext, useContext, useRef, useState } from "react";

type EditorContextType = {
  editorRef: React.MutableRefObject<editor.IStandaloneCodeEditor | null>;
  monacoRef: React.MutableRefObject<Monaco | null>;
  validationError: string;
  setValidationError: (error: string) => void;
};

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const useEditorRef = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditorRef must be used within an EditorProvider");
  }
  return context.editorRef;
};

export const useMonacoRef = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useMonacoRef must be used within an EditorProvider");
  }
  return context.monacoRef;
};

export const useValidationError = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useValidationError must be used within an EditorProvider");
  }
  return { validationError: context.validationError, setValidationError: context.setValidationError };
};

export const EditorProvider = ({ children }: { children: React.ReactNode }) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const [validationError, setValidationError] = useState("");

  return (
    <EditorContext.Provider value={{ editorRef, monacoRef, validationError, setValidationError }}>
      {children}
    </EditorContext.Provider>
  );
};
