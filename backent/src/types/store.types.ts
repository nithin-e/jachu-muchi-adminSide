import { StoreStatus } from "../models/Store";

export interface CreateStoreInput {
  name: string;
  description: string;
  images?: string[];
  status?: StoreStatus;
  address?: string;
  phone?: string;
  email?: string;
}

export interface UpdateStoreInput {
  name?: string;
  description?: string;
  images?: string[];
  status?: StoreStatus;
  address?: string;
  phone?: string;
  email?: string;
}
