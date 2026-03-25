import { IAlumniDocument } from "../../models/Alumni";
import { CreateAlumniInput, UpdateAlumniInput } from "../../types/alumni.types";

export interface IAlumniRepository {
  create(payload: CreateAlumniInput): Promise<IAlumniDocument>;
  findById(id: string): Promise<IAlumniDocument | null>;
  updateById(
    id: string,
    payload: UpdateAlumniInput
  ): Promise<IAlumniDocument | null>;
  deleteById(id: string): Promise<IAlumniDocument | null>;

  filter(params: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    type?: string;
    sortBy?: string;
    order?: "asc" | "desc";
  }): Promise<{
    data: IAlumniDocument[];
    total: number;
    page: number;
    pages: number;
  }>;
}
