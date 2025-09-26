import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Store } from '../stores/store.model';
import { Rating } from '../ratings/rating.model';
import { User } from '../users/user.model';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class OwnerService {
  constructor(
    @InjectModel(Store) private storeModel: typeof Store,
    @InjectModel(Rating) private ratingModel: typeof Rating,
    @InjectConnection()
    private sequelize: Sequelize,
  ) {}

  async getDashboardData(ownerId: string) {
    const store = await this.storeModel.findOne({ where: { ownerId } });
    if (!store) {
      throw new NotFoundException('No store assigned to this owner.');
    }

    const storeId = store.id;

    const avgRatingResult = await this.ratingModel.findOne({
      attributes: [
        [this.sequelize.fn('AVG', this.sequelize.col('rating')), 'averageRating'],
      ],
      where: { storeId },
      raw: true,
    });

    const ratingsWithUsers = await this.ratingModel.findAll({
      where: { storeId },
      include: [{
        model: User,
        attributes: ['name'],
      }],
    });

    return {
      // If avgRatingResult is null, default to 0. Otherwise, format the number.
      averageRating: avgRatingResult && avgRatingResult['averageRating']
        ? Number(avgRatingResult['averageRating']).toFixed(2)
        : '0.00',
      ratings: ratingsWithUsers,
    };
  }
}