import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
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
import { JwtBodyInterface } from '../interfaces/jwt-body.interface';
import { AuthenticatedUserRequestInterInterface } from '../interfaces/authenticated-user-request.interface';
import { AuthGuard } from '../guards/auth.guard';
import { AuthGoogleGuard } from '../guards/auth.google.guard';

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

  // logout
  @Post('logout')
  @UseGuards(AuthGuard)
  logout(
    @Req() req: AuthenticatedUserRequestInterInterface,
    @Res() res: Response,
  ) {
    const user: JwtBodyInterface = req?.user;
    if (!user)
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
    // delete the cookies
    res.clearCookie(CookiesConstants.accessToken, { httpOnly: true });
    res.clearCookie(CookiesConstants.refreshToken, { httpOnly: true });
    throw new HttpException('unauthenticated', HttpStatus.OK);
  }

  // is authenticated
  @Get('is-authenticated')
  @UseGuards(AuthGuard)
  IsAuthenticated(@Req() req: AuthenticatedUserRequestInterInterface): {
    authenticated: boolean;
    data: JwtBodyInterface;
  } {
    const user: JwtBodyInterface = req?.user;
    if (!user)
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
    return { authenticated: true, data: user };
  }

  // Google auth

  // login
  @Get('google/login')
  @UseGuards(AuthGoogleGuard)
  googleLogin() {
    return 'Your in the login';
  }

  // redirect url
  @Get('google/redirect')
  @UseGuards(AuthGoogleGuard)
  @Redirect('/auth/is-authenticated')
  googleRedirect() {
    return '';
  }
}
