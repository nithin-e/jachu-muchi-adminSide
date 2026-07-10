import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { IStoreDocument } from "../../models/Store";
import { IStoreRepository } from "../../repositories/interfaces/IStoreRepository";
import { CreateStoreInput, UpdateStoreInput } from "../../types/store.types";
import { throwBadRequest, throwNotFound } from "../../utils/http-errors.helper";
import { IStoreService } from "../interfaces/IStoreService";
import { MESSAGES } from "../../constants/messages";

function tryRemoveStoreImageFiles(imageUrls: string[]): void {
  for (const imageUrl of imageUrls) {
    if (!imageUrl?.trim()) continue;
    const base = "/uploads/stores/";
    if (!imageUrl.includes(base)) continue;
    const filename = path.basename(imageUrl);
    if (!filename || filename === "." || filename === "..") continue;
    const absolute = path.join(process.cwd(), "uploads", "stores", filename);
    fs.unlink(absolute, () => {});
  }
}

export class StoreService implements IStoreService {
  constructor(private readonly storeRepository: IStoreRepository) {}

  async createStore(input: CreateStoreInput): Promise<IStoreDocument> {
    const name = input.name?.trim();
    const description = input.description?.trim();

    if (!name) throwBadRequest(MESSAGES.STORE.NAME_REQUIRED);
    if (!description) throwBadRequest(MESSAGES.STORE.DESCRIPTION_REQUIRED);

    const payload: CreateStoreInput = {
      name,
      description,
      images: input.images ?? [],
      status: input.status,
      address: input.address?.trim(),
      phone: input.phone?.trim(),
      email: input.email?.trim(),
    };

    return this.storeRepository.create(payload);
  }

  async updateStore(
    storeId: string,
    input: UpdateStoreInput
  ): Promise<IStoreDocument> {
    if (!mongoose.Types.ObjectId.isValid(storeId)) {
      throwBadRequest(MESSAGES.STORE.INVALID_ID);
    }

    const existing = await this.storeRepository.findById(storeId);
    if (!existing) {
      throwNotFound(MESSAGES.STORE.NOT_FOUND);
    }

    const payload: UpdateStoreInput = {};
    if (input.name !== undefined) payload.name = input.name.trim();
    if (input.description !== undefined) payload.description = input.description.trim();
    if (input.images !== undefined) payload.images = input.images;
    if (input.status !== undefined) payload.status = input.status;
    if (input.address !== undefined) payload.address = input.address.trim();
    if (input.phone !== undefined) payload.phone = input.phone.trim();
    if (input.email !== undefined) payload.email = input.email.trim();

    const updated = await this.storeRepository.updateById(storeId, payload);
    if (!updated) {
      throwNotFound(MESSAGES.STORE.NOT_FOUND);
    }

    if (
      input.images !== undefined &&
      existing.images &&
      existing.images.length > 0
    ) {
      const removed = existing.images.filter(
        (url) => !input.images!.includes(url)
      );
      tryRemoveStoreImageFiles(removed);
    }

    return updated;
  }

  async deleteStore(storeId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(storeId)) {
      throwBadRequest(MESSAGES.STORE.INVALID_ID);
    }

    const removed = await this.storeRepository.deleteById(storeId);
    if (!removed) {
      throwNotFound(MESSAGES.STORE.NOT_FOUND);
    }

    tryRemoveStoreImageFiles(removed.images ?? []);
  }

  async getStoreById(storeId: string): Promise<IStoreDocument> {
    if (!mongoose.Types.ObjectId.isValid(storeId)) {
      throwBadRequest(MESSAGES.STORE.INVALID_ID);
    }

    const doc = await this.storeRepository.findById(storeId);
    if (!doc) {
      throwNotFound(MESSAGES.STORE.NOT_FOUND);
    }

    return doc;
  }

  async listAllStores(): Promise<IStoreDocument[]> {
    return this.storeRepository.listAll();
  }
}
