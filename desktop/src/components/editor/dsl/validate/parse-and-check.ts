import { LineCounter, parseDocument } from "yaml";
import type { ZodIssue, ZodSchema } from "zod";

export const parseAndCheck = (content: string, schema: ZodSchema) => {
  const lineCounter = new LineCounter();
  const doc = parseDocument(content, { keepSourceTokens: true, lineCounter });

  if (doc.contents === null) {
    return {
      parsedContent: null,
      issues: [] as ZodIssue[],
      doc,
      lineCounter,
    };
  }

  const obj = doc.toJS();
  const result = schema.safeParse(obj);

  if (result.success) {
    return {
      parsedContent: obj,
      issues: [] as ZodIssue[],
      doc,
      lineCounter,
    };
  }
  return {
    parsedContent: obj,
    issues: result.error.issues,
    doc,
    lineCounter,
  };
};
