import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import type React from "react";
import { createContext, useContext, useRef, useState } from "react";

type ValidationError = { message: string; line: number };

type ChangeSource = "circuit" | "dsl";

type EditorContextType = {
  editorRef: React.MutableRefObject<editor.IStandaloneCodeEditor | null>;
  monacoRef: React.MutableRefObject<Monaco | null>;
  validationError: ValidationError[];
  setValidationError: (error: ValidationError[]) => void;
  changeSource: ChangeSource;
  setChangeSource: (source: ChangeSource) => void;
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

export const useChangeSource = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useChangeSource must be used within an EditorProvider");
  }
  return { changeSource: context.changeSource, setChangeSource: context.setChangeSource };
};

export const EditorProvider = ({ children }: { children: React.ReactNode }) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const [validationError, setValidationError] = useState<ValidationError[]>([]);
  const [changeSource, setChangeSource] = useState<ChangeSource>("circuit");

  return (
    <EditorContext.Provider
      value={{
        editorRef,
        monacoRef,
        validationError,
        setValidationError,
        changeSource,
        setChangeSource,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};
