import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from '../users/user.model';
import { HasMany } from 'sequelize-typescript';
import { Rating } from '../ratings/rating.model';

@Table({ tableName: 'stores', timestamps: true })
export class Store extends Model<Store> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  declare email: string;

  @Column({ type: DataType.STRING(400) })
  declare address: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true }) // Can be assigned later
  declare ownerId: string;

  @HasMany(() => Rating)
  declare ratings: Rating[];
}