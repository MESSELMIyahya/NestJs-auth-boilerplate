import { Body, Controller, HttpCode, Inject, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserInterface } from '../../user/interfaces/create-user.interface';
import { AuthService } from '../services/auth.service';
import { ZodValidationPipe } from 'src/core/pipes/zodValidation.pipe';
import {
  RegisterUserValidationSchema,
  RegisterUserValidationSchemaType,
} from '../validation/register-user.schema';
import {
  LoginUserValidationSchema,
  LoginUserValidationSchemaType,
} from '../validation/login-user.schema';
import { CookiesConstants } from '../constants';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  // register the user
  @Post('register')
  async register(
    @Body(new ZodValidationPipe(RegisterUserValidationSchema))
    body: RegisterUserValidationSchemaType,
  ): Promise<CreateUserInterface> {
    const user = await this.authService.Register(body as CreateUserInterface);
    return user;
  }

  // login the user
  @HttpCode(200)
  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body(new ZodValidationPipe(LoginUserValidationSchema))
    body: LoginUserValidationSchemaType,
  ) {
    const tokens = await this.authService.Login(
      body as Required<LoginUserValidationSchemaType>,
    );
    if (tokens) {
      // setting the cookies
      res.cookie(CookiesConstants.accessToken, tokens.accessToken, {
        httpOnly: true,
      });
      res.cookie(CookiesConstants.refreshToken, tokens.refreshToken, {
        httpOnly: true,
      });
    }
    return { accessToken: tokens.accessToken };
  }
}
