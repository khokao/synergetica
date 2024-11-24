import { z } from "zod";

const ControlRelationSchema = z.object({
  name: z.string(),
  type: z.string(),
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
  category: z.string(),
  sequence: z.string(),
  controlBy: z.array(ControlRelationSchema),
  controlTo: z.array(ControlRelationSchema),
  meta: MetaSchema,
});
