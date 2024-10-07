import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserInterface } from '../../user/interfaces/user.interface';
import { UserService } from '../../user/services/user.service';
import { CreateUserInterface } from '../../user/interfaces/create-user.interface';
import { LogicUserInterface } from '../interfaces/login-user.interface';
import { JwtBodyInterface } from '../../jwt/interfaces/jwt-body.interface';
import { compare } from 'bcrypt';
import { JwtService } from '../../jwt/services/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Users') private UserModel: Model<UserInterface>,

    @Inject(JwtService)
    private readonly jwtService: JwtService,

    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  // Register
  async Register(
    user: Omit<CreateUserInterface, 'oauth' | 'oauthProvider'>,
  ): Promise<CreateUserInterface> {
    const newUser = await this.userService.createUser({
      ...user,
      oauth: false,
      oauthProvider: '',
    });
    return newUser;
  }

  // Login
  async Login(body: LogicUserInterface): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    // verifying the user
    const user = await this.userService.getUserByEmail(body.email);
    if (!user)
      throw new HttpException('No user with this email', HttpStatus.NOT_FOUND);

    // checking the passwords
    const match = await this.comparePasswords(
      body.password,
      user.access.password,
    );
    if (!match)
      throw new HttpException('Password is incorrect', HttpStatus.UNAUTHORIZED);

    try {
      // generating the tokens
      const jwtBody: JwtBodyInterface = {
        id: user._id.toString(),
        role: user.access.role,
        email: user.profileInfo.email,
        username: user.profileInfo.username,
        pic: user.profileInfo.pic,
      };

      const accessToken = await this.jwtService.generateAccessToken(jwtBody);
      const refreshToken = await this.jwtService.generateRefreshToken(jwtBody);

      return {
        accessToken,
        refreshToken,
      };
    } catch {
      throw new HttpException('Server Error', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  // login oauth
  async LoginOAuth(email: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    // verifying the user
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new HttpException('No user with this email', HttpStatus.NOT_FOUND);
    }

    // if the user isn't oauth
    if (!user.access.oauth) {
      throw new HttpException('No user with this email', HttpStatus.NOT_FOUND);
    }

    try {
      // generating the tokens
      const jwtBody: JwtBodyInterface = {
        id: user._id.toString(),
        role: user.access.role,
        email: user.profileInfo.email,
        username: user.profileInfo.username,
        pic: user.profileInfo.pic,
      };

      const accessToken = await this.jwtService.generateAccessToken(jwtBody);
      const refreshToken = await this.jwtService.generateRefreshToken(jwtBody);

      return {
        accessToken,
        refreshToken,
      };
    } catch {
      throw new HttpException('Server Error', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  // verifying passwords
  private async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      return await compare(password, hashedPassword);
    } catch {
      return false;
    }
  }
}
