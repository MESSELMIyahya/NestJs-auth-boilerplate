import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Users',
        schema: UserSchema,
      },
    ]),
  ],
  providers: [UserService],
  exports:[UserService],
})
export class UserModule {}
