import { useEditorRef, useMonacoRef } from "@/components/editor/editor-context";
import { circuitSchema } from "@/components/editor/schema";
import type { editor } from "monaco-editor";
import { useEffect, useState } from "react";
import { LineCounter, isMap, isScalar, isSeq, parseDocument } from "yaml";

export const useDslParser = (value: string) => {
  const editorRef = useEditorRef();
  const monacoRef = useMonacoRef();

  // biome-ignore lint/suspicious/noExplicitAny: safeParse Object
  const [dsl, setDsl] = useState<any | null>(null);
  const [errors, setErrors] = useState<{ message: string; line: number }[]>([]);
  const [markers, setMarkers] = useState<editor.IMarkerData[]>([]);

  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;

    if (!editor || !monaco) return;

    const lineCounter = new LineCounter();
    const doc = parseDocument(value, { keepSourceTokens: true, lineCounter });

    if (doc.contents === null) {
      setDsl(null);
      setErrors([]);
      setMarkers([]);
      return;
    }

    const result = circuitSchema.safeParse(doc.toJS());

    if (result.success) {
      setDsl(result.data);
      setErrors([]);
      setMarkers([]);
    } else {
      const parsedErrors = result.error.issues.map((issue) => {
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

      setDsl(null);
      setErrors(parsedErrors.map((e) => e.errorMessage));
      setMarkers(parsedErrors.map((e) => e.marker));
    }
  }, [value, monacoRef, editorRef]);

  return { dsl, errors, markers };
};
