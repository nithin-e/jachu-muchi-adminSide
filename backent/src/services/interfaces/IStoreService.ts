import { IStoreDocument } from "../../models/Store";
import { CreateStoreInput, UpdateStoreInput } from "../../types/store.types";

export interface IStoreService {
  createStore(input: CreateStoreInput): Promise<IStoreDocument>;
  updateStore(
    storeId: string,
    input: UpdateStoreInput
  ): Promise<IStoreDocument>;
  deleteStore(storeId: string): Promise<void>;
  getStoreById(storeId: string): Promise<IStoreDocument>;
  listAllStores(): Promise<IStoreDocument[]>;
}
