import { parseAndCheck } from "@/components/editor/validate/parse-and-check";
import type { editor } from "monaco-editor";
import type { Document, LineCounter } from "yaml";
import { isMap, isScalar, isSeq } from "yaml";
import type { ZodSchema } from "zod";
import type { ZodIssue } from "zod";

const createMarkers = (issues: ZodIssue[], doc: Document.Parsed, lineCounter: LineCounter): editor.IMarkerData[] => {
  if (issues.length === 0) {
    return [];
  }

  const markers: editor.IMarkerData[] = issues.map((issue) => {
    const path = issue.path;
    const node = doc.getIn(path, true);

    let startLine = 1;
    let startCol = 1;
    let endLine = 1;
    let endCol = 1;

    if ((isMap(node) || isSeq(node) || isScalar(node)) && node.range) {
      const [start, , end] = node.range;
      const startPos = lineCounter.linePos(start);
      const endPos = lineCounter.linePos(end);
      if (startPos) {
        startLine = startPos.line;
        startCol = startPos.col;
      }
      if (endPos) {
        endLine = endPos.line;
        endCol = endPos.col + 1;
      }
    } else {
      // fallback to parent node
      const parentPath = path.slice(0, -1);
      const parentNode = doc.getIn(parentPath, true);
      if ((isMap(parentNode) || isSeq(parentNode) || isScalar(parentNode)) && parentNode.range) {
        const [start, , end] = parentNode.range;
        const startPos = lineCounter.linePos(start);
        const endPos = lineCounter.linePos(end);
        if (startPos) {
          startLine = startPos.line;
          startCol = startPos.col;
        }
        if (endPos) {
          endLine = endPos.line;
          endCol = endPos.col + 1;
        }
      }
    }

    const marker: editor.IMarkerData = {
      severity: 8, // monaco.MarkerSeverity.Error
      message: issue.message,
      startLineNumber: startLine,
      startColumn: startCol,
      endLineNumber: endLine,
      endColumn: endCol,
    };

    return marker;
  });

  return markers;
};

export const validateContent = (
  content: string,
  schema: ZodSchema,
): {
  validationErrors: { message: string; line: number }[] | null;
  markers: editor.IMarkerData[];
  parsedContent;
} => {
  const { parsedContent, issues, doc, lineCounter } = parseAndCheck(content, schema);

  // no contents
  if (!doc.contents) {
    return { validationErrors: null, markers: [], parsedContent: null };
  }

  // no issues
  if (issues.length === 0) {
    return { validationErrors: [], markers: [], parsedContent: parsedContent };
  }

  // with issues
  const markers = createMarkers(issues, doc, lineCounter);

  const validationErrors = markers.map((marker) => ({
    message: marker.message,
    line: marker.startLineNumber,
  }));

  return { validationErrors, markers, parsedContent };
};
