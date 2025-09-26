import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Store } from './store.model';
import { StoresService } from './stores.service';
import { AdminStoresController } from '../admin/stores.controller';

@Module({
  imports: [SequelizeModule.forFeature([Store])],
  providers: [StoresService],
  controllers: [AdminStoresController], // Register the controller
})
export class StoresModule {}