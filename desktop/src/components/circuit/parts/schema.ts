import { z } from "zod";

const controlByParamsSchema = z.object({
  Ymax: z.coerce.number().positive({ message: "Ymax must be a positive number." }),
  Ymin: z.coerce.number().positive({ message: "Ymin must be a positive number." }),
  K: z.coerce.number().positive({ message: "K must be a positive number." }),
  n: z.coerce.number().positive({ message: "n must be a positive number." }),
});

const controlBySchema = z.object({
  name: z.string().min(1, { message: "Control part name is required." }),
  type: z.enum(["Activation", "Repression"], { message: "Control type must be 'Activation' or 'Repression'." }),
  params: controlByParamsSchema.optional(),
});

const basePartSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  description: z.string({ message: "Description must be a string." }),
  category: z.enum(["Promoter", "Protein", "Terminator"], {
    message: "Category must be 'Promoter', 'Protein', or 'Terminator'.",
  }),
  sequence: z.string().regex(/^[ATCGatcg]+$/, { message: "DNA sequence must contain only A, T, C, or G." }),
});

const promoterSchema = basePartSchema.extend({
  category: z.literal("Promoter"),
  controlBy: z.array(controlBySchema),
  params: z.object({
    Ydef: z.coerce.number().positive({
      message: "Ydef must be a positive number for Promoter.",
    }),
  }),
});

const proteinSchema = basePartSchema.extend({
  category: z.literal("Protein"),
  controlBy: z.array(controlBySchema).length(0),
  params: z.object({
    Dp: z.coerce.number().positive({
      message: "Dp must be a positive number for Protein.",
    }),
    TIRb: z.coerce.number().positive({
      message: "TIRb must be a positive number for Protein.",
    }),
  }),
});

const terminatorSchema = basePartSchema.extend({
  category: z.literal("Terminator"),
  controlBy: z.array(controlBySchema).length(0),
  params: z.object({}),
});

export const partSchema = z.discriminatedUnion("category", [promoterSchema, proteinSchema, terminatorSchema]);

export const partsCollectionSchema = z
  .record(z.string(), partSchema)
  .refine((p) => Object.entries(p).every(([key, value]) => key === value.name), {
    message: "Key must match the part name.",
  });
