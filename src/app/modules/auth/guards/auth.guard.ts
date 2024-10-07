import { Response } from 'express';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthenticatedUserRequestInterInterface } from '../interfaces/authenticated-user-request.interface';
import { JwtBodyInterface } from '../../jwt/interfaces/jwt-body.interface';
import { CookiesConstants } from '../../jwt/constants';
import { JwtService } from '../../jwt/services/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(JwtService)
    private readonly JwtService: JwtService,
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
    const verify_accessToken = this.JwtService.verifyAccessToken(accessToken);
    const verify_refreshToken =
      this.JwtService.verifyRefreshToken(refreshToken);
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

      const newAccessToken = this.JwtService.generateAccessToken(body);
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
