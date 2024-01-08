import { z } from 'zod';

export const formSchema = z.object({
  user: z.string().trim().min(1, 'User is Required'),
  repository: z.string().trim().min(1, 'Repository is Required'),
  file: z.string().trim().min(1, 'File is Required'),
});

export type FormType = z.infer<typeof formSchema>;
