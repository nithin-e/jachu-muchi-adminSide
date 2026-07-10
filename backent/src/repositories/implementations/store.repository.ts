import { StoreModel, IStoreDocument } from "../../models/Store";
import { CreateStoreInput, UpdateStoreInput } from "../../types/store.types";
import { IStoreRepository } from "../interfaces/IStoreRepository";

export class StoreRepository implements IStoreRepository {
  async create(payload: CreateStoreInput): Promise<IStoreDocument> {
    const doc = new StoreModel({
      name: payload.name,
      description: payload.description,
      images: payload.images ?? [],
      status: payload.status ?? "Active",
      address: payload.address,
      phone: payload.phone,
      email: payload.email,
    });
    return doc.save();
  }

  async findById(id: string): Promise<IStoreDocument | null> {
    return StoreModel.findById(id);
  }

  async updateById(
    id: string,
    payload: UpdateStoreInput
  ): Promise<IStoreDocument | null> {
    const set: Record<string, unknown> = {};
    if (payload.name !== undefined) set.name = payload.name;
    if (payload.description !== undefined) set.description = payload.description;
    if (payload.images !== undefined) set.images = payload.images;
    if (payload.status !== undefined) set.status = payload.status;
    if (payload.address !== undefined) set.address = payload.address;
    if (payload.phone !== undefined) set.phone = payload.phone;
    if (payload.email !== undefined) set.email = payload.email;
    return StoreModel.findByIdAndUpdate(id, { $set: set }, { new: true });
  }

  async deleteById(id: string): Promise<IStoreDocument | null> {
    return StoreModel.findByIdAndDelete(id);
  }

  async listAll(): Promise<IStoreDocument[]> {
    return StoreModel.find().sort({ createdAt: -1 }).lean();
  }
}
