import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedUserRequestInterInterface } from '../interfaces/authenticated-user-request.interface';
import { AuthService } from '../services/auth.service';
import { CookiesConstants } from '../constants';

@Injectable()
export class AuthGoogleGuard extends AuthGuard('google') {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    const req: AuthenticatedUserRequestInterInterface = context
      .switchToHttp()
      .getRequest();
    const res: Response = context.switchToHttp().getResponse();
    const activate = (await super.canActivate(context)) as boolean;

    if (req.user && activate) {
      // login the user
      const tokens = await this.authService.LoginOAuth(req.user.email);
      if (tokens) {
        // setting the cookies
        res.cookie(CookiesConstants.accessToken, tokens.accessToken, {
          httpOnly: true,
        });
        res.cookie(CookiesConstants.refreshToken, tokens.refreshToken, {
          httpOnly: true,
        });
        return activate;
      }
      return;
    } else {
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
    }
  }
}
