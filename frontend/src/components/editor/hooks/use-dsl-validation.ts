import { useEditorRef, useMonacoRef, useValidationError } from "@/components/editor/editor-context";
import { useDslParser } from "@/components/editor/hooks/use-dsl-parser";
import { useEffect } from "react";

export const useDslValidation = (value: string) => {
  const editorRef = useEditorRef();
  const monacoRef = useMonacoRef();
  const { setValidationError } = useValidationError();

  const { errors, markers } = useDslParser(value);

  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;

    if (!editor || !monaco) return;

    const model = editor.getModel();

    setValidationError(errors);
    model && monaco.editor.setModelMarkers(model, "owner", markers);
  }, [errors, markers, editorRef, monacoRef, setValidationError]);
};
