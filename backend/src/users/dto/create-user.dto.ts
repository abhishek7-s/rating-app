import { UserRole } from '../user.model';

export class CreateUserDto {
  name!: string;
  email!: string;
  password!: string;
  address?: string;
  role?: UserRole;
}