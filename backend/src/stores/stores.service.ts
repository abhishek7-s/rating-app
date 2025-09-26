import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Store } from './store.model';
import { CreateStoreDto } from './dto/create-store.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectModel(Store)
    private storeModel: typeof Store,
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const store = this.storeModel.build(createStoreDto as any);
    return store.save();
  }

  async findAll(): Promise<Store[]> {
    return this.storeModel.findAll();
  }
}