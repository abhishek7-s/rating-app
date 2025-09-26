import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../users/user.model';
import { Store } from '../stores/store.model';

@Table({ tableName: 'ratings', timestamps: true, indexes: [{ unique: true, fields: ['userId', 'storeId'] }] })
export class Rating extends Model<Rating> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare rating: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare userId: string;

  @ForeignKey(() => Store)
  @Column({ type: DataType.UUID, allowNull: false })
  declare storeId: string;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Store)
  store: Store;
}