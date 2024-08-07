import { z } from 'zod';

export const RegisterUserValidationSchema = z
  .object({
    username: z.string().min(4, 'Username must be more then 4 characters'),
    fullName: z.string().min(4, 'FullName must be more then 4 characters'),
    email: z.string().email('Email Is not valid'),
    pic: z.string().default(''),
    password: z.string().min(8, 'Password must be more then 8 characters'),
  })
  .required();

export type RegisterUserValidationSchemaType = z.infer<
  typeof RegisterUserValidationSchema
>;
