import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Request, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto) { 
    return this.authService.signUp(signUpDto);
  }

  @UseGuards(JwtAuthGuard) 
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('password')
  updatePassword(@Request() req, @Body() updatePasswordDto: UpdatePasswordDto) {
    const userId = req.user.id;
    return this.authService.updatePassword(userId, updatePasswordDto);
  }
}