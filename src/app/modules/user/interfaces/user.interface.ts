import { AuthUserRole } from 'src/core/interfaces/auth.type';
// User Interface

export interface UserInterface {
  id: string;
  // profile info
  profileInfo: {
    pic: string;
    username: string;
    email: string;
    fullName: string;
  };
  // access or auth
  access: {
    role: AuthUserRole;
    canPost: boolean;
    password: string;
    verified: boolean;
  };

  postedCourses: string[];
  courses: string[];

  createdAt: string;
  updatedAt: string;
}
