import { z } from 'zod';

export const LoginUserValidationSchema = z.object({
  email: z.string().email('Email Is not valid'),
  password: z.string(),
}).required();

export type LoginUserValidationSchemaType = z.infer<
  typeof LoginUserValidationSchema
>;
