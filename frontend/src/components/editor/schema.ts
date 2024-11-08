import { PROMOTER_NAMES, PROTEIN_NAMES, TERMINATOR_NAMES } from "@/components/circuit/nodes/constants";
import { z } from "zod";

function assertNonEmptyArray<T>(array: T[]): asserts array is [T, ...T[]] {
  if (array.length === 0) {
    throw new Error("Array must not be empty");
  }
}

assertNonEmptyArray(PROMOTER_NAMES);
assertNonEmptyArray(PROTEIN_NAMES);
assertNonEmptyArray(TERMINATOR_NAMES);

const promoterSchema = z.object({
  promoter: z.array(
    z.object({
      name: z.enum(PROMOTER_NAMES, { errorMap: () => ({ message: "Invalid promoter name." }) }),
    }),
  ),
});

const proteinSchema = z.object({
  protein: z.array(
    z.object({
      name: z.enum(PROTEIN_NAMES, { errorMap: () => ({ message: "Invalid protein name." }) }),
    }),
  ),
});

const terminatorSchema = z.object({
  terminator: z.array(
    z.object({
      name: z.enum(TERMINATOR_NAMES, { errorMap: () => ({ message: "Invalid terminator name." }) }),
    }),
  ),
});

const chainItemSchema = z.union([promoterSchema, proteinSchema, terminatorSchema]);

const chainSchema = z.array(z.any()).superRefine((chain, ctx) => {
  let hasError = false;
  const sequence = chain.map((item, index) => {
    if (!item || typeof item !== "object") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Each item in the chain must be an node object.",
        path: [index],
      });
      hasError = true;
      return "unknown";
    }

    const result = chainItemSchema.safeParse(item);
    if (!result.success) {
      const key = Object.keys(item)[0] || "unknown";
      if (key === "promoter" || key === "protein" || key === "terminator") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Invalid ${key} params.`,
          path: [index],
        });
      } else {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Node key must be one of ['promoter', 'protein', 'terminator'].",
          path: [index],
        });
      }
      hasError = true;
      return "unknown";
    }
    return Object.keys(item)[0];
  });

  if (hasError) {
    return;
  }

  let i = 0;
  const n = sequence.length;

  if (sequence[i] !== "promoter") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "The chain must start with at least one promoter.",
      path: [i],
    });
    return;
  }
  while (i < n && sequence[i] === "promoter") {
    i++;
  }

  if (i >= n || sequence[i] !== "protein") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "At least one protein must follow the promoter(s).",
      path: [i],
    });
    return;
  }
  while (i < n && sequence[i] === "protein") {
    i++;
  }

  if (i >= n || sequence[i] !== "terminator") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "A terminator must follow the protein(s).",
      path: [i],
    });
    return;
  }
  i++;
  if (i < n) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "No elements are allowed after the terminator.",
      path: [i],
    });
    return;
  }
});

export const circuitSchema = z
  .object({
    circuit: z.array(z.object({ chain: chainSchema }).strict({ message: "Under 'circuit', key must be 'chain'." })),
  })
  .strict({ message: "Root key must be 'circuit'." });
