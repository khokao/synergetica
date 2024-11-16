import type { ValidationError } from "@/components/editor/editor-context";
import { strictCircuitSchema } from "@/components/editor/schemas/strictSchema";
import type { editor } from "monaco-editor";
import { LineCounter, isMap, isScalar, isSeq, parseDocument } from "yaml";
import type { z } from "zod";

export const validateDslContent = (
  content: string,
): {
  validationErrors: ValidationError[];
  markers: editor.IMarkerData[];
  parsedContent: z.infer<typeof strictCircuitSchema> | null;
} => {
  const lineCounter = new LineCounter();
  const doc = parseDocument(content, { keepSourceTokens: true, lineCounter });

  if (doc.contents === null) {
    return { validationErrors: [], markers: [], parsedContent: null };
  }

  const dsl = doc.toJS();
  const result = strictCircuitSchema.safeParse(dsl);

  if (result.success) {
    return { validationErrors: [], markers: [], parsedContent: dsl };
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
      severity: 8, // monaco.MarkerSeverity.Error
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

  return { validationErrors, markers, parsedContent: dsl };
};
