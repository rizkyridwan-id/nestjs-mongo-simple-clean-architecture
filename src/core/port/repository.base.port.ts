import {
  ClientSession,
  Document,
  FilterQuery,
  SortOrder,
  Types,
  UpdateQuery,
} from 'mongoose';
import { IPaginationMeta } from 'src/core/interface/pagination-meta.interface';
import { IRepositoryResponse } from 'src/core/interface/repository-response.interface';

export interface BaseRepositoryPort<
  MongoEntity,
  MongoDocument extends Document,
> {
  findAll(session?: ClientSession): Promise<MongoDocument[]>;
  findOne(
    identifier: FilterQuery<MongoEntity>,
    session?: ClientSession,
  ): Promise<MongoDocument | null>;

  findOneOrThrow(
    identifier: FilterQuery<MongoEntity>,
    errorMessage?: string,
    session?: ClientSession,
  ): Promise<MongoDocument>;

  findOneAndThrow(
    identifier: FilterQuery<MongoEntity>,
    session?: ClientSession,
  ): Promise<void>;

  findOneAndThrow(
    identifier: FilterQuery<MongoEntity>,
    errorMessage?: string,
    session?: ClientSession,
  ): Promise<void>;

  findOneLatest(
    identifier: FilterQuery<MongoEntity>,
    session?: ClientSession,
  ): Promise<MongoDocument | null>;
  findById(
    id: Types.ObjectId,
    session?: ClientSession,
  ): Promise<MongoDocument | null>;
  findBy(
    identifier: FilterQuery<MongoEntity>,
    session?: ClientSession,
  ): Promise<MongoDocument[]>;
  findByPaginated(
    identifier: FilterQuery<MongoEntity>,
    paginationMeta: IPaginationMeta,
  ): Promise<MongoDocument[]>;
  findByPaginateSorted(
    identifier: FilterQuery<MongoEntity>,
    paginationMeta: IPaginationMeta,
    sort: { [key: string]: SortOrder | { $meta: any } },
  ): Promise<MongoDocument[]>;
  count(): Promise<number>;
  countBy(identifier: FilterQuery<MongoEntity>): Promise<number>;
  save(
    entity: MongoEntity,
    session?: ClientSession,
  ): Promise<IRepositoryResponse>;
  saveReturnDocument(
    entity: MongoEntity,
    session?: ClientSession,
  ): Promise<Document<any, any>>;
  saveMany(
    entity: MongoEntity[],
    session?: ClientSession,
  ): Promise<IRepositoryResponse>;
  updateOne(
    identifier: FilterQuery<MongoEntity>,
    data: UpdateQuery<MongoEntity>,
    session?: ClientSession,
  ): Promise<IRepositoryResponse>;
  updateOneWithoutThrow(
    identifier: FilterQuery<MongoEntity>,
    data: UpdateQuery<MongoEntity>,
    session?: ClientSession,
  ): Promise<IRepositoryResponse>;
  updateMany(
    identifier: FilterQuery<MongoEntity>,
    data: UpdateQuery<Partial<MongoEntity>>,
    session?: ClientSession,
  ): Promise<IRepositoryResponse>;
  delete(
    identifier: FilterQuery<MongoEntity>,
    session?: ClientSession,
  ): Promise<IRepositoryResponse>;
  deleteWithoutThrow(
    identifier: FilterQuery<MongoEntity>,
    session?: ClientSession,
  ): Promise<IRepositoryResponse>;
  deleteAll(session?: ClientSession): Promise<IRepositoryResponse>;
}
