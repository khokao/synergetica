import { z } from "zod";

const ControlRelationSchema = z.object({
  name: z.string(),
  type: z.enum(["activation", "repression"]),
});

const MetaSchema = z
  .object({
    Pmax: z.number(),
    Ymax: z.number(),
    Ymin: z.number(),
    K: z.number(),
    n: z.number(),
    Dp: z.number(),
  })
  .nullable();

export const PartSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.enum(["promoter", "protein", "terminator"]),
  sequence: z.string().regex(/^[ATCGatcg]+$/),
  controlBy: z.array(ControlRelationSchema),
  controlTo: z.array(ControlRelationSchema),
  meta: MetaSchema,
});

export const PartsCollectionSchema = z
  .record(z.string(), PartSchema)
  .refine((p) => Object.entries(p).every(([key, value]) => key === value.name));
