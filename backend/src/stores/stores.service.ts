import { Injectable, NotFoundException } from '@nestjs/common';
// 1. Make sure 'InjectConnection' is imported from '@nestjs/sequelize'
import { InjectModel, InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Store } from './store.model';
import { CreateStoreDto } from './dto/create-store.dto';

@Injectable()
export class StoresService {
  // 2. Make sure the @InjectConnection() decorator is right before 'private sequelize'
  constructor(
    @InjectModel(Store)
    private storeModel: typeof Store,
    @InjectConnection()
    private sequelize: Sequelize,
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const store = this.storeModel.build(createStoreDto as any);
    return store.save();
  }

  async findAll(): Promise<Store[]> {
    return this.storeModel.findAll();
  }
  
  async findAllWithRatingsForUser(userId: string): Promise<any[]> {
    return this.storeModel.findAll({
      attributes: {
        include: [
          [
            this.sequelize.fn('AVG', this.sequelize.col('ratings.rating')),
            'averageRating',
          ],
          [
            this.sequelize.literal(`(
              SELECT rating FROM ratings AS user_rating
              WHERE
                user_rating."storeId" = "Store"."id"
                AND
                user_rating."userId" = '${userId}'
            )`),
            'userRating',
          ],
        ],
      },
      include: [{
        model: this.sequelize.models.Rating,
        as: 'ratings',
        attributes: [],
      }],
      group: ['Store.id'],
      raw: true,
    });
  }

  async assignOwner(storeId: string, ownerId: string): Promise<Store> {
    const store = await this.storeModel.findByPk(storeId);
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    store.ownerId = ownerId;
    return store.save();
  }

  async findAllForAdmin(): Promise<any[]> {
    return this.storeModel.findAll({
      attributes: {
        include: [
          [
            this.sequelize.fn('AVG', this.sequelize.col('ratings.rating')),
            'averageRating',
          ],
        ],
      },
      include: [{
        model: this.sequelize.models.Rating,
        as: 'ratings',
        attributes: [],
      }],
      group: ['Store.id'],
      raw: true,
    });
  }

}