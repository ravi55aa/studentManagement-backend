import { Document, FilterQuery, Model, Types } from 'mongoose';

export class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  //*FIND */
  public async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  public async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  public async findMany(filter: FilterQuery<T>): Promise<T[] | []> {
    return this.model.find(filter).exec();
  }

  //*UPDATE
  public async updateById(id: string, updateData: Partial<T>): Promise<T | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    return this.model.findByIdAndUpdate(id, { $set: updateData }, { new: true }).lean<T>();
  }

  //**Create */
  public async create(data: Partial<T>): Promise<T | null> {
    const newUser = await this.model.create(data);
    return newUser;
  }
}
