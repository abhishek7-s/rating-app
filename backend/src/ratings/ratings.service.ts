import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Rating } from './rating.model';

@Injectable()
export class RatingsService {
  constructor(
    @InjectModel(Rating)
    private ratingModel: typeof Rating,
  ) {}

  async upsert(dto: { userId: string; storeId: string; rating: number }): Promise<Rating> {
    const existingRating = await this.ratingModel.findOne({
      where: {
        userId: dto.userId,
        storeId: dto.storeId,
      },
    });

    if (existingRating) {
      existingRating.rating = dto.rating;
      return existingRating.save();
    }

    return this.ratingModel.create(dto as any);
  }
}