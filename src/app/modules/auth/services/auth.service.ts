import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserInterface } from '../../user/interfaces/user.interface';
import { UserService } from '../../user/services/user.service';
import { CreateUserInterface } from '../../user/interfaces/create-user.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Users') private UserModel: Model<UserInterface>,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  // Register
  async Register(user: CreateUserInterface): Promise<CreateUserInterface> {
    const newUser = await this.userService.createUser(user);
    return newUser;
  }
}
