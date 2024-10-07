import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService as NestJWTService } from '@nestjs/jwt';
import { JwtBodyInterface } from '../interfaces/jwt-body.interface';

@Injectable()
export class JwtService {
  // constants
  AUTH_SECRET = process.env.AUTH_SECRET_KEY;

  constructor(
    @Inject(NestJWTService)
    private readonly nestJWTService: NestJWTService,
  ) {}

  // Verify Access token
  verifyAccessToken(token: string): JwtBodyInterface | undefined {
    try {
      const res = this.nestJWTService.verify(token, {
        secret: this.AUTH_SECRET,
      });

      return res as JwtBodyInterface;
    } catch {
      return undefined;
    }
  }

  // Verify Refresh token
  verifyRefreshToken(token: string): JwtBodyInterface | undefined {
    try {
      const res = this.nestJWTService.verify(token, {
        secret: this.AUTH_SECRET,
      });

      return res as JwtBodyInterface;
    } catch {
      return undefined;
    }
  }

  // Generate access token
  generateAccessToken(body: JwtBodyInterface): string {
    try {
      const token = this.nestJWTService.sign(body, {
        secret: this.AUTH_SECRET,
        expiresIn: process.env.AUTH_ACCESS_TOKEN_EXPIRE,
      });

      return token;
    } catch {
      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // generate refresh token
  generateRefreshToken(body: JwtBodyInterface): string {
    try {
      const token = this.nestJWTService.sign(body, {
        secret: this.AUTH_SECRET,
        expiresIn: process.env.AUTH_REFRESH_TOKEN_EXPIRE,
      });

      return token;
    } catch {
      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
