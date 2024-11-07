import { useEditorRef, useMonacoRef, useValidationError } from "@/components/editor/editor-context";
import type { editor } from "monaco-editor";
import { useEffect } from "react";
import { LineCounter, isMap, isScalar, isSeq, parseDocument } from "yaml";
import type { ZodSchema } from "zod";
import { fromError } from "zod-validation-error";

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
      const lineCounter = new LineCounter();
      const doc = parseDocument(value, { keepSourceTokens: true, lineCounter });

      const result = schema.safeParse(doc.toJS());

      if (result.success) {
        setValidationError("");
        model && monaco.editor.setModelMarkers(model, "owner", []);
        return;
      }

      setValidationError(fromError(result.error).toString());

      const markers: editor.IMarkerData[] = result.error.issues.map((issue) => {
        const path = issue.path;
        const node = doc.getIn(path, true);

        let startPos = { line: 1, col: 1 };
        let endPos = { line: 1, col: 1 };

        if ((isMap(node) || isSeq(node) || isScalar(node)) && node.range != null) {
          const [start, , end] = node.range;
          startPos = lineCounter.linePos(start);
          endPos = lineCounter.linePos(end);
        }

        return {
          severity: monaco.MarkerSeverity.Error,
          message: issue.message,
          startLineNumber: startPos.line,
          startColumn: startPos.col,
          endLineNumber: endPos.line,
          endColumn: endPos.col + 1,
        };
      });

      model && monaco.editor.setModelMarkers(model, "owner", markers);
    };

    validate();
  }, [value, schema, editorRef, monacoRef, setValidationError]);
};
