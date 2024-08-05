import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hash } from 'bcrypt';
import {
  UserInterface,
  UserSchemaDocumentType,
} from '../interfaces/user.interface';
import { CreateUserInterface } from '../interfaces/create-user.interface';

@Injectable()
export class UserService {
  // Injecting the Users model
  constructor(@InjectModel('Users') private UserModel: Model<UserInterface>) {}

  // Create User
  async createUser(user: CreateUserInterface): Promise<CreateUserInterface> {
    // verify if the email is taken
    const isEmailTaken = await this.IsEmailTaken(user.email);
    if (isEmailTaken) {
      throw new HttpException('Email is already taken', HttpStatus.CONFLICT);
    }
    try {
      // encrypting the password
      const encryptedPassword = await hash(user.password, 10);
      // the user model
      const newUser = new this.UserModel({
        profileInfo: {
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          pic: '',
        },
        access: {
          role: 'User',
          password: encryptedPassword,
          canPost: false,
          verified: false,
        },
        courses: [],
        postedCourses: [],
      });
      //   creating the user
      const res = await newUser.save();

      return {
        username: res.profileInfo.username,
        email: res.profileInfo.email,
        fullName: res.profileInfo.fullName,
        password: res.access.password,
      };
    } catch (err) {
      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Get User
  async getUserByEmail(
    email: string,
  ): Promise<UserSchemaDocumentType | undefined> {
    try {
      return (
        (await this.UserModel.findOne({ 'profileInfo.email': email })) ||
        undefined
      );
    } catch {
      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Private methods

  // Is email taken
  private async IsEmailTaken(email: string): Promise<boolean> {
    try {
      const user = await this.UserModel.findOne({ 'profileInfo.email': email });
      return user._id ? true : false;
    } catch {
      return false;
    }
  }
}
