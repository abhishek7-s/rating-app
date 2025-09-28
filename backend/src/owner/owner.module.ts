import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OwnerController } from './owner.controller';
import { OwnerService } from './owner.service';
import { Store } from '../stores/store.model';
import { Rating } from '../ratings/rating.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Store, Rating]),
  ],
  controllers: [OwnerController],
  providers: [OwnerService],
})
export class OwnerModule {}