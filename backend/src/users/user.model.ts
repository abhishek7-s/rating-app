import { Table, Column, Model, DataType } from 'sequelize-typescript';

export enum UserRole {
  SYSTEM_ADMIN = 'system_admin',
  NORMAL_USER = 'normal_user',
  STORE_OWNER = 'store_owner',
}

@Table({ tableName: 'users', timestamps: true })
export class User extends Model<User> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({ type: DataType.STRING(60), allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING(400) })
  address: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    defaultValue: UserRole.NORMAL_USER,
    allowNull: false,
  })
  role: UserRole;
}