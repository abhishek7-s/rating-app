import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import { AdminUsersController } from 'src/admin/users.controller';
import { User } from './user.model';
import { Store } from 'src/stores/store.model';
import { Rating } from 'src/ratings/rating.model';

@Module({
  imports: [SequelizeModule.forFeature([User, Store, Rating])],
  providers: [UsersService],
  controllers: [AdminUsersController],
  exports: [UsersService],
})
export class UsersModule {}