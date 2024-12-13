import { z } from "zod";

const promoterSchema = z.object({
  type: z.literal("Promoter"),
});

const proteinSchema = z.object({
  type: z.literal("Protein"),
});

const terminatorSchema = z.object({
  type: z.literal("Terminator"),
});

const chainItemSchema = z.discriminatedUnion("type", [promoterSchema, proteinSchema, terminatorSchema]);

const looseChainSchema = z
  .object({
    chain: z.array(chainItemSchema),
  })
  .strict();

export const looseCircuitSchema = z.array(looseChainSchema);
