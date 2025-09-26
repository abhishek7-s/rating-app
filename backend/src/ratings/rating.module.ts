import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Rating } from './rating.model';
import { RatingsService } from './ratings.service';

@Module({
  imports: [SequelizeModule.forFeature([Rating])], // Register the Rating model here
  providers: [RatingsService],
  exports: [RatingsService], // Export the service so other modules can use it
})
export class RatingsModule {}