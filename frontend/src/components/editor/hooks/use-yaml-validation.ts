import { nullValidationError } from "@/components/editor/constants";
import { useEditorRef, useMonacoRef, useValidationError } from "@/components/editor/editor-context";
import type { editor } from "monaco-editor";
import { useEffect } from "react";
import { LineCounter, isMap, isScalar, isSeq, parseDocument } from "yaml";
import type { ZodSchema } from "zod";

export const useYamlValidation = (value: string, schema: ZodSchema) => {
  const editorRef = useEditorRef();
  const monacoRef = useMonacoRef();
  const { setValidationError } = useValidationError();

  useEffect(() => {
    const validate = () => {
      const editor = editorRef.current;
      const monaco = monacoRef.current;

      if (!editor || !monaco) return;

      const model = editor.getModel();

      if (value === null || value.trim() === "") {
        setValidationError(nullValidationError);

        model &&
          monaco.editor.setModelMarkers(model, "owner", [
            {
              severity: monaco.MarkerSeverity.Error,
              message: nullValidationError[0].message,
              startLineNumber: 1,
              startColumn: 1,
              endLineNumber: 1,
              endColumn: 1,
            },
          ]);
        return;
      }

      const lineCounter = new LineCounter();
      const doc = parseDocument(value, { keepSourceTokens: true, lineCounter });

      const result = schema.safeParse(doc.toJS());

      if (result.success) {
        setValidationError([]);
        model && monaco.editor.setModelMarkers(model, "owner", []);
        return;
      }

      const errors = result.error.issues.map((issue) => {
        const path = issue.path;
        const node = doc.getIn(path, true);

        let startPos = { line: 1, col: 1 };
        let endPos = { line: 1, col: 1 };
        let line = 1;

        if ((isMap(node) || isSeq(node) || isScalar(node)) && node.range != null) {
          const [start, , end] = node.range;
          startPos = lineCounter.linePos(start);
          endPos = lineCounter.linePos(end);
          line = startPos.line;
        }

        const errorMessage = {
          message: issue.message,
          line: line,
        };

        const marker: editor.IMarkerData = {
          severity: monaco.MarkerSeverity.Error,
          message: issue.message,
          startLineNumber: startPos.line,
          startColumn: startPos.col,
          endLineNumber: endPos.line,
          endColumn: endPos.col + 1,
        };

        return { errorMessage, marker };
      });

      const validationErrors = errors.map((e) => e.errorMessage);
      const markers = errors.map((e) => e.marker);

      setValidationError(validationErrors);
      model && monaco.editor.setModelMarkers(model, "owner", markers);
    };

    validate();
  }, [value, schema, editorRef, monacoRef, setValidationError]);
};
