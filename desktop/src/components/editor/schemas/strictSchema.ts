import { useParts } from "@/components/circuit/parts/parts-context";
import { z } from "zod";

export const useStrictSchema = () => {
  const { promoterParts, proteinParts, terminatorParts } = useParts();

  const promoterNames = Object.keys(promoterParts);
  const proteinNames = Object.keys(proteinParts);
  const terminatorNames = Object.keys(terminatorParts);

  const promoterSchema = z
    .object({
      type: z.literal("Promoter"),
      name: z.enum(promoterNames as [string, ...string[]], {
        required_error: "Missing required key: name",
        invalid_type_error: "Invalid Promoter name.",
      }),
    })
    .strict({
      message: "Unexpected key in chain item.",
    });

  const proteinSchema = z
    .object({
      type: z.literal("Protein"),
      name: z.enum(proteinNames as [string, ...string[]], {
        required_error: "Missing required key: name",
        invalid_type_error: "Invalid Protein name.",
      }),
    })
    .strict({
      message: "Unexpected key in chain item.",
    });

  const terminatorSchema = z
    .object({
      type: z.literal("Terminator"),
      name: z.enum(terminatorNames as [string, ...string[]], {
        required_error: "Missing required key: name",
        invalid_type_error: "Invalid Terminator name.",
      }),
    })
    .strict({
      message: "Unexpected key in chain item.",
    });

  const chainItemSchema = z.discriminatedUnion("type", [promoterSchema, proteinSchema, terminatorSchema], {
    errorMap: () => ({ message: "Invalid 'type' value. Expected 'Promoter', 'Protein', or 'Terminator'." }),
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
                  if (item.type === "Promoter") {
                    state = "Promoter";
                  } else {
                    ctx.addIssue({
                      code: z.ZodIssueCode.custom,
                      message: "Chain must start with a Promoter.",
                      path: [i],
                    });
                    return;
                  }
                  break;

                case "Promoter":
                  if (item.type === "Promoter") {
                    state = "Promoter";
                  } else if (item.type === "Protein") {
                    state = "Protein";
                  } else {
                    ctx.addIssue({
                      code: z.ZodIssueCode.custom,
                      message: "A Terminator cannot directly follow a Promoter. At least one Protein must follow.",
                      path: [i],
                    });
                    return;
                  }
                  break;

                case "Protein":
                  if (item.type === "Protein") {
                    state = "Protein";
                  } else if (item.type === "Terminator") {
                    state = "Terminator";
                  } else {
                    ctx.addIssue({
                      code: z.ZodIssueCode.custom,
                      message: "A Promoter cannot appear after Proteins.",
                      path: [i],
                    });
                    return;
                  }
                  break;

                case "Terminator":
                  ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "No elements are allowed after the Terminator.",
                    path: [i],
                  });
                  return;

                default:
                  return;
              }
            }

            if (state === "Promoter") {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "After Promoter(s), at least one Protein must follow before a Terminator.",
                path: [chain.length - 1],
              });
            } else if (state !== "Terminator") {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Chain must end with a Terminator.",
                path: [chain.length - 1],
              });
            }
          }),
      },
      { message: "The key must be 'chain'." },
    )
    .strict({ message: "Unexpected key in chain object. Only 'chain' is allowed." });

  const strictCircuitSchema = z.array(strictChainSchema);

  return {
    strictCircuitSchema,
  };
};
