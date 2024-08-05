import {
  Body,
  Controller,
  Inject,
  Post,
} from '@nestjs/common';
import { CreateUserInterface } from '../../user/interfaces/create-user.interface';
import { AuthService } from '../services/auth.service';
import { ZodValidationPipe } from 'src/core/pipes/zodValidation.pipe';
import { RegisterUserValidationSchema, RegisterUserValidationSchemaType } from '../validation/register-user.schema';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  // register the user
  @Post()
  async register(
    @Body(new ZodValidationPipe(RegisterUserValidationSchema)) body: RegisterUserValidationSchemaType,
  ): Promise<CreateUserInterface> {
    const user = await this.authService.Register(body as CreateUserInterface);
    return user;
  }
}
