import { z } from "zod";

const castToValOrNull = <T extends Parameters<typeof z.preprocess>[1]>(
  schema: T
) =>
  z.preprocess((val) => {
    if (typeof val === "string") {
      const trimmedVal = val.trim();
      return trimmedVal.length > 0 ? trimmedVal : null;
    }
    return null;
  }, schema);

export const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters long")
    .max(255),
  repository: z.string().trim().min(1, "Repository is Required"),
  file: z.string().trim().min(1, "File is Required"),
  schedule: z.string().trim().min(1, "Schedule is Required"),
});

export type FormType = z.infer<typeof formSchema>;
