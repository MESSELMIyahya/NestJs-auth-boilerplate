import {
  HttpException,
  HttpStatus,
  PipeTransform,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      const parsed = this.schema.parse(value);
      return parsed;
    } catch(err) {
      throw new HttpException('Body is not valid', HttpStatus.BAD_REQUEST);
    }
  }
}
