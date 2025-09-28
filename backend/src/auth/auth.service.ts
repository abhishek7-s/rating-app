import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto'; // Import DTOs
import { SignUpDto } from './dto/signup.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user.get();
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(signUpDto: SignUpDto) {
    const existingUser = await this.usersService.findOneByEmail(signUpDto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }
    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
    const user = await this.usersService.create({
      ...signUpDto,
      password: hashedPassword,
    });
    const { password, ...result } = user.get();
    return result;
  }

  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordMatching = await bcrypt.compare(
      updatePasswordDto.currentPassword,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Current password does not match.');
    }

    const hashedNewPassword = await bcrypt.hash(updatePasswordDto.newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return { message: 'Password updated successfully.' };
  }
}