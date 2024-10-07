import { Global, Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { JwtService } from './services/jwt.service';

@Global()
@Module({
  imports: [
    NestJwtModule.register({
      global: true,
      secret: process.env.AUTH_SECRET_KEY,
      signOptions: { expiresIn: process.env.AUTH_REFRESH_TOKEN_EXPIRE },
    }),
  ],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
