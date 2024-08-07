import { Schema } from 'mongoose';
import { UserInterface } from '../interfaces/user.interface';

export const UserSchema = new Schema<UserInterface>(
  {
    profileInfo: {
      pic: {
        type: String,
        required: false,
        default: '',
      },
      username: {
        required: true,
        type: String,
        minlength: 4,
      },
      fullName: {
        required: true,
        type: String,
        minlength: 4,
      },
      email: {
        required: true,
        type: String,
        unique: true,
      },
    },
    access: {
      role: {
        required: true,
        type: String,
        enum: ['Admin', 'User', 'Poster'],
        default: 'User',
      },
      oauth: {
        required: true,
        type: Boolean,
        default: false,
      },
      oauthProvider: {
        required: false,
        type: String,
        enum: ['google', ''],
        default: '',
      },
      canPost: {
        required: true,
        type: Boolean,
        default: false,
      },
      password: {
        required: false,
        type: String,
        minlength: 8,
      },
      verified: {
        required: true,
        type: Boolean,
        default: false,
      },
    },
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Courses',
      },
    ],
    postedCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Courses',
      },
    ],
  },
  { _id: true, timestamps: true },
);
