import { IStoreDocument } from "../../models/Store";
import { CreateStoreInput, UpdateStoreInput } from "../../types/store.types";

export interface IStoreRepository {
  create(payload: CreateStoreInput): Promise<IStoreDocument>;
  findById(id: string): Promise<IStoreDocument | null>;
  updateById(
    id: string,
    payload: UpdateStoreInput
  ): Promise<IStoreDocument | null>;
  deleteById(id: string): Promise<IStoreDocument | null>;
  listAll(): Promise<IStoreDocument[]>;
}
