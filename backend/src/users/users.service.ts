import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './user.model';
import { Store } from 'src/stores/store.model';
import { Rating } from 'src/ratings/rating.model';
import { Op } from 'sequelize';


@Injectable()
export class UsersService {

  constructor(
  @InjectModel(User) private userModel: typeof User,
  @InjectConnection() private sequelize: Sequelize,
  @InjectModel(Store) private storeModel: typeof Store,
  @InjectModel(Rating) private ratingModel: typeof Rating,
) {}

  async findAll(filters: { name?: string; email?: string; role?: UserRole; address?: string }): Promise<Partial<User>[]> {
    const where: any = {};
    if (filters.name) {
      where.name = { [Op.iLike]: `%${filters.name}%` };
    }
    if (filters.email) {
      where.email = { [Op.iLike]: `%${filters.email}%` };
    }
    if (filters.address) {
      where.address = { [Op.iLike]: `%${filters.address}%` };
    }
    if (filters.role) {
      where.role = filters.role;
    }

    return this.userModel.findAll({
      where,
      attributes: {
        exclude: ['password'],
        include: [
          // This subquery calculates the average rating of the store owned by the user
          [
            this.sequelize.literal(`(
              SELECT AVG(ratings.rating)
              FROM stores
              INNER JOIN ratings ON stores.id = ratings."storeId"
              WHERE stores."ownerId" = "User"."id"
            )`),
            'storeAverageRating', // The result will be available under this alias
          ],
        ],
      },
      raw: true, // Return plain data objects
    });
  }

  async createByAdmin(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const existingUser = await this.findOneByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const user = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    } as any);

    const { password, ...result } = user.get();
    return result;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({
      where: { email },
      attributes: { include: ['password'] },
    });
  }

  async findOneById(id: string): Promise<User | null> {
    return this.userModel.findOne({
      where: { id },
      attributes: { include: ['password'] },
    });
  }

  async create(userData: CreateUserDto): Promise<User> {
    const user = this.userModel.build(userData as any);
    return user.save();
  }

  async getDashboardStats() {
    const totalUsers = await this.userModel.count();
    const totalStores = await this.storeModel.count();
    const totalRatings = await this.ratingModel.count();
    return { totalUsers, totalStores, totalRatings };
  }

}