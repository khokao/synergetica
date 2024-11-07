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
      name: z.enum(PROMOTER_NAMES),
    }),
  ),
});

const proteinSchema = z.object({
  protein: z.array(
    z.object({
      name: z.enum(PROTEIN_NAMES),
    }),
  ),
});

const terminatorSchema = z.object({
  terminator: z.array(
    z.object({
      name: z.enum(TERMINATOR_NAMES),
    }),
  ),
});

const chainSchema = z.array(z.union([promoterSchema, proteinSchema, terminatorSchema])).superRefine((chain, ctx) => {
  const sequence = chain.map((item) => {
    if ("promoter" in item) return "promoter";
    if ("protein" in item) return "protein";
    if ("terminator" in item) return "terminator";
    return "unknown";
  });

  let i = 0;
  const n = sequence.length;

  // Check for at least one promoter at the beginning
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
  if (i === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "At least one promoter is required at the beginning of the chain.",
      path: [i],
    });
    return;
  }

  // Check for at least one protein after promoters
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

  // Check for exactly one terminator after proteins
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

  // Ensure exactly one terminator is present
  const terminatorCount = sequence.filter((s) => s === "terminator").length;
  if (terminatorCount !== 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Exactly one terminator is required.",
    });
  }

  // Check for unknown elements
  if (sequence.includes("unknown")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Unknown element type found in the chain.",
    });
  }
});

export const circuitSchema = z.object({
  circuit: z.array(z.object({ chain: chainSchema })),
});
