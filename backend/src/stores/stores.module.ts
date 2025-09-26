import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Store } from './store.model';
import { StoresService } from './stores.service';
import { AdminStoresController } from '../admin/stores.controller';
import { RatingsModule } from 'src/ratings/rating.module';
import { StoresController } from 'src/stores.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([Store]),
    RatingsModule,
  ],
  providers: [StoresService],
  controllers: [AdminStoresController, StoresController],
})
export class StoresModule {}