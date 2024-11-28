import { z } from "zod";

const ControlRelationSchema = z.object({
  name: z.string(),
  type: z.enum(["activation", "repression"]),
});

const MetaSchema = z
  .object({
    // use the coerce helper: https://github.com/shadcn-ui/ui/issues/421#issuecomment-1561080201
    Pmax: z.coerce.number().positive(),
    Ymax: z.coerce.number().positive(),
    Ymin: z.coerce.number().positive(),
    K: z.coerce.number().positive(),
    n: z.coerce.number().positive(),
    Dp: z.coerce.number().positive(),
  })
  .nullable();

export const partSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.enum(["promoter", "protein", "terminator"]),
  sequence: z.string().regex(/^[ATCGatcg]+$/),
  controlBy: z.array(ControlRelationSchema),
  controlTo: z.array(ControlRelationSchema),
  meta: MetaSchema,
});

export const partsCollectionSchema = z
  .record(z.string(), partSchema)
  .refine((p) => Object.entries(p).every(([key, value]) => key === value.name));
