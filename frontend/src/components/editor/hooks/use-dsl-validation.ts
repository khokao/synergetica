import { useEditorRef, useMonacoRef, useValidationError } from "@/components/editor/editor-context";
import { strictCircuitSchema } from "@/components/editor/schemas/strictSchema";
import type { editor } from "monaco-editor";
import { useEffect } from "react";
import { LineCounter, isMap, isScalar, isSeq, parseDocument } from "yaml";

export const useDslValidation = (value: string) => {
  const editorRef = useEditorRef();
  const monacoRef = useMonacoRef();
  const { setValidationError } = useValidationError();

  useEffect(() => {
    const validate = () => {
      const editor = editorRef.current;
      const monaco = monacoRef.current;

      if (!editor || !monaco) return;

      const model = editor.getModel();

      const lineCounter = new LineCounter();
      const doc = parseDocument(value, { keepSourceTokens: true, lineCounter });

      if (doc.contents === null) {
        setValidationError([]);
        model && monaco.editor.setModelMarkers(model, "owner", []);
        return;
      }

      const dsl = doc.toJS();
      const result = strictCircuitSchema.safeParse(dsl);

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
        } else {
          const parentPath = path.slice(0, -1);
          const parentNode = doc.getIn(parentPath, true);
          if ((isMap(parentNode) || isSeq(parentNode) || isScalar(parentNode)) && parentNode.range != null) {
            const [start, , end] = parentNode.range;
            startPos = lineCounter.linePos(start);
            endPos = lineCounter.linePos(end);
            line = startPos.line;
          }
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
  }, [value, editorRef, monacoRef, setValidationError]);
};
