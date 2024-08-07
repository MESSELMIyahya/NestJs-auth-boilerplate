import { Request, Response } from 'express';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CookiesConstants } from '../constants';
import { AuthService } from '../services/auth.service';
import { AuthenticatedUserRequestInterInterface } from '../interfaces/authenticated-user-request.interface';
import { JwtBodyInterface } from '../interfaces/jwt-body.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: AuthenticatedUserRequestInterInterface = context
      .switchToHttp()
      .getRequest();
    const res: Response = context.switchToHttp().getResponse();

    // get the tokens from the req's cookies
    const accessToken = req.cookies[CookiesConstants.accessToken];
    const refreshToken = req.cookies[CookiesConstants.refreshToken];

    if (!accessToken || !refreshToken)
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);

    // verify the access token
    const verify_accessToken = this.authService.verifyAccessToken(accessToken);
    const verify_refreshToken =
      this.authService.verifyRefreshToken(refreshToken);
    // if the access expired and the refresh token is valid
    if (!verify_accessToken && verify_refreshToken) {
      // generate new access token
      const body: JwtBodyInterface = {
        id: verify_refreshToken.id,
        role: verify_refreshToken.role,
        email: verify_refreshToken.email,
        username: verify_refreshToken.username,
        pic: verify_refreshToken.pic,
      };

      const newAccessToken = this.authService.generateAccessToken(body);
      // setting the cookies
      res.cookie(CookiesConstants.accessToken, newAccessToken, {
        httpOnly: true,
      });

      // setting the user ojb in the req
      req.user = verify_refreshToken;
      return true;
    } else if (verify_accessToken && verify_refreshToken) {
      // if the token are valid
      // setting the user ojb in the req
      req.user = verify_accessToken;
      return true;
    } else {
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
    }
  }
}
