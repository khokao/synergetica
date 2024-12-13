import { z } from "zod";

const ControlRelationSchema = z.object({
  name: z.string().min(1, { message: "Control part name is required." }),
  type: z.enum(["Activation", "Repression"], { message: "Control type must be 'Activation' or 'Repression'." }),
});

const MetaSchema = z
  .object({
    // use the coerce helper: https://github.com/shadcn-ui/ui/issues/421#issuecomment-1561080201
    Pmax: z.coerce.number({ message: "Pmax must be a number" }).positive({ message: "Pmax must be a positive number" }),
    Ymax: z.coerce.number({ message: "Ymax must be a number" }).positive({ message: "Ymax must be a positive number" }),
    Ymin: z.coerce.number({ message: "Ymin must be a number" }).positive({ message: "Ymin must be a positive number" }),
    K: z.coerce.number({ message: "K must be a number" }).positive({ message: "K must be a positive number" }),
    n: z.coerce.number({ message: "n must be a number" }).positive({ message: "n must be a positive number" }),
    Dp: z.coerce.number({ message: "Dp must be a number" }).positive({ message: "Dp must be a positive number" }),
  })
  .nullable();

export const partSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  description: z.string({ message: "Description must be a string." }),
  category: z.enum(["Promoter", "Protein", "Terminator"], {
    message: "Category must be 'Promoter', 'Protein', or 'Terminator'.",
  }),
  sequence: z.string().regex(/^[ATCGatcg]+$/, { message: "DNA sequence must contain only A, T, C, or G." }),
  controlBy: z.array(ControlRelationSchema, { message: "controlBy must be an array." }),
  controlTo: z.array(ControlRelationSchema, { message: "controlTo must be an array." }),
  meta: MetaSchema,
});

export const partsCollectionSchema = z
  .record(z.string(), partSchema)
  .refine((p) => Object.entries(p).every(([key, value]) => key === value.name), {
    message: "Key must match the part name.",
  });
