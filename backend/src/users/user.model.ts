import { Table, Column, Model, DataType, Scopes } from 'sequelize-typescript';
import { HasMany } from 'sequelize-typescript';
import { Rating } from '../ratings/rating.model';

export enum UserRole {
  SYSTEM_ADMIN = 'system_admin',
  NORMAL_USER = 'normal_user',
  STORE_OWNER = 'store_owner',
}

@Scopes(() => ({
  withPassword: {
    attributes: { include: ['password'] },
  },
}))

@Table({ tableName: 'users', timestamps: true })
export class User extends Model<User> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({ type: DataType.STRING(60), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  @Column({ type: DataType.STRING(400) })
  declare address: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    defaultValue: UserRole.NORMAL_USER,
    allowNull: false,
  })
  declare role: UserRole;

  @HasMany(() => Rating)
  declare ratings: Rating[];
}