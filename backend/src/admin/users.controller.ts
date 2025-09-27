import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.model';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.SYSTEM_ADMIN)
  findAll(@Query() query: { name?: string; email?: string; role?: UserRole; address?: string }) {
    return this.usersService.findAll(query);
  }

  @Post()
  @Roles(UserRole.SYSTEM_ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createByAdmin(createUserDto);
  }

  @Get('stats')
  @Roles(UserRole.SYSTEM_ADMIN)
  getStats() {
    return this.usersService.getDashboardStats();
  }

}