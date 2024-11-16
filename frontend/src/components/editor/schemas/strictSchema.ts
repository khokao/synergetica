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

const promoterSchema = z
  .object({
    type: z.literal("promoter"),
    name: z.enum(PROMOTER_NAMES, {
      required_error: "Missing required key: name",
      invalid_type_error: "Invalid promoter name.",
    }),
  })
  .strict({
    message: "Unexpected key in chain item.",
  });

const proteinSchema = z
  .object({
    type: z.literal("protein"),
    name: z.enum(PROTEIN_NAMES, {
      required_error: "Missing required key: name",
      invalid_type_error: "Invalid protein name.",
    }),
  })
  .strict({
    message: "Unexpected key in chain item.",
  });

const terminatorSchema = z
  .object({
    type: z.literal("terminator"),
    name: z.enum(TERMINATOR_NAMES, {
      required_error: "Missing required key: name",
      invalid_type_error: "Invalid terminator name.",
    }),
  })
  .strict({
    message: "Unexpected key in chain item.",
  });

const chainItemSchema = z.discriminatedUnion("type", [promoterSchema, proteinSchema, terminatorSchema], {
  errorMap: () => ({ message: "Invalid 'type' value. Expected 'promoter', 'protein', or 'terminator'." }),
});

const strictChainSchema = z
  .object(
    {
      chain: z
        .array(chainItemSchema, { message: "The 'chain' key must contain an array of chain items." })
        .superRefine((chain, ctx) => {
          let state = "start";

          for (let i = 0; i < chain.length; i++) {
            const item = chain[i];

            switch (state) {
              case "start":
                if (item.type === "promoter") {
                  state = "promoter";
                } else {
                  ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Chain must start with a promoter.",
                    path: [i],
                  });
                  return;
                }
                break;

              case "promoter":
                if (item.type === "promoter") {
                  state = "promoter";
                } else if (item.type === "protein") {
                  state = "protein";
                } else {
                  ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "A terminator cannot directly follow a promoter. At least one protein must follow.",
                    path: [i],
                  });
                  return;
                }
                break;

              case "protein":
                if (item.type === "protein") {
                  state = "protein";
                } else if (item.type === "terminator") {
                  state = "terminator";
                } else {
                  ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "A promoter cannot appear after proteins.",
                    path: [i],
                  });
                  return;
                }
                break;

              case "terminator":
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: "No elements are allowed after the terminator.",
                  path: [i],
                });
                return;

              default:
                return;
            }
          }

          if (state !== "terminator") {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Chain must end with a terminator.",
              path: [chain.length - 1],
            });
          }
        }),
    },
    { message: "The key must be 'chain'." },
  )
  .strict({ message: "Unexpected key in chain object. Only 'chain' is allowed." });

export const strictCircuitSchema = z.array(strictChainSchema);
