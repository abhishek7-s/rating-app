import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto'; // Import the DTO

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findOneByEmail(email: string): Promise<User | null> { // Change undefined to null
    return this.userModel.findOne({ where: { email } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> { // Use the DTO
    const user = this.userModel.build(createUserDto as any); // Use DTO, cast as any for build
    return user.save();
  }
}