import { PassportStrategy } from '@nestjs/passport';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UserService } from '../../user/services/user.service';
import { JwtBodyInterface } from '../interfaces/jwt-body.interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {
    super({
      clientID: process.env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:4500/auth/google/redirect',
      passReqToCallback: true,
      session: false,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _: string,
    __: string,
    ___,
    profile: Profile,
    next: VerifyCallback,
  ) {
    try {
      // get the email
      const email = profile.emails[0].value;
      // check for the user
      const existedUser = await this.userService.getUserByEmail(email);
      //  if the user does exist in the db
      if (existedUser) {
        const userObj: JwtBodyInterface = {
          id: existedUser._id as never,
          email: existedUser.profileInfo.email,
          username: existedUser.profileInfo.username,
          pic: existedUser.profileInfo.pic,
          role: existedUser.access.role,
        };
        return next(null, userObj);
      }
      //  if the user doesn't exist
      //  create new user
      const createdUser = await this.userService.createUser({
        email,
        fullName: profile.displayName,
        username: profile._json.name || `${profile.name.givenName} ${profile.name.familyName}`,
        pic: profile.photos[0].value,
        oauth: true,
        oauthProvider: 'google',
        password: '',
      });
      // fetch the user
      const newUser = await this.userService.getUserByEmail(email);

      const userObj: JwtBodyInterface = {
        id: newUser._id.toString(),
        email: newUser.profileInfo.email,
        username: newUser.profileInfo.username,
        pic: newUser.profileInfo.pic,
        role: newUser.access.role,
      };

      return next(null, userObj);
    } catch (err){
      return next(
        new HttpException("Server Err", HttpStatus.SERVICE_UNAVAILABLE),
        null,
      );
    }
  }
}
