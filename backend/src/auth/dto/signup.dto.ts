export class SignUpDto {
  name!: string;
  email!: string;
  password!: string;
  address?: string; // Address can be optional
}