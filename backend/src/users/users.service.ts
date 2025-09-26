import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async findAll(): Promise<Partial<User>[]> {
    return this.userModel.findAll({
      attributes: { exclude: ['password'] },
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

  async create(userData: CreateUserDto): Promise<User> {
    const user = this.userModel.build(userData as any);
    return user.save();
  }
}