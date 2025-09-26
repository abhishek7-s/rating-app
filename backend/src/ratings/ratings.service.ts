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
    const [rating] = await this.ratingModel.upsert(dto as any);
    return rating;
  }
}