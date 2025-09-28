import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Rating } from './rating.model';
import { RatingsService } from './ratings.service';

@Module({
  imports: [SequelizeModule.forFeature([Rating])], 
  providers: [RatingsService],
  exports: [RatingsService],  
})
export class RatingsModule {}