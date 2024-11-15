import { z } from "zod";

const promoterSchema = z.object({
  type: z.literal("promoter"),
});

const proteinSchema = z.object({
  type: z.literal("protein"),
});

const terminatorSchema = z.object({
  type: z.literal("terminator"),
});

const chainItemSchema = z.discriminatedUnion("type", [promoterSchema, proteinSchema, terminatorSchema]);

const looseChainSchema = z
  .object({
    chain: z.array(chainItemSchema),
  })
  .strict();

export const looseCircuitSchema = z
  .object({
    circuit: z.array(looseChainSchema),
  })
  .strict();
