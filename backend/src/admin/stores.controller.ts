import { Controller, Get, Post, Body, UseGuards, Patch, Param } from '@nestjs/common';
import { StoresService } from '../stores/stores.service';
import { CreateStoreDto } from '../stores/dto/create-store.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';  
import { Roles } from '../auth/roles.decorator';  
import { UserRole } from '../users/user.model'; 
import { AssignOwnerDto } from 'src/stores/dto/assign-owner.dto';

@Controller('admin/stores')
@UseGuards(JwtAuthGuard, RolesGuard) // Protect all routes in this controller
export class AdminStoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @Roles(UserRole.SYSTEM_ADMIN)
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storesService.create(createStoreDto);
  }

  @Get()
  @Roles(UserRole.SYSTEM_ADMIN)
  findAll() {
    return this.storesService.findAll();
  }

  @Patch(':storeId/assign-owner')
  @Roles(UserRole.SYSTEM_ADMIN)
  assignOwner(
    @Param('storeId') storeId: string,
    @Body() assignOwnerDto: AssignOwnerDto,
  ) {
    return this.storesService.assignOwner(storeId, assignOwnerDto.ownerId);
  }
}