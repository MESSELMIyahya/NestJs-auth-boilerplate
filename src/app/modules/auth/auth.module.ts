import { Module } from '@nestjs/common';
import { UserService } from '../user/services/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../user/schemas/user.schema';
import { UserModule } from '../user/user.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthGuard } from './guards/auth.guard';
import { JwtService } from '../jwt/services/jwt.service';
import { JwtModule } from '../jwt/jwt.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Users',
        schema: UserSchema,
      },
    ]),
    UserModule,
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [JwtService, AuthService, UserService, GoogleStrategy, AuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
