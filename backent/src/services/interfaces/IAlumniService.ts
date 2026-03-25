import { IAlumniDocument } from "../../models/Alumni";
import { CreateAlumniInput, UpdateAlumniInput } from "../../types/alumni.types";

export interface IAlumniService {
  createAlumni(input: CreateAlumniInput): Promise<IAlumniDocument>;
  updateAlumni(
    alumniId: string,
    input: UpdateAlumniInput
  ): Promise<IAlumniDocument>;
  deleteAlumni(alumniId: string): Promise<void>;
  getAlumniById(alumniId: string): Promise<IAlumniDocument>;

  filterAlumni(params: {
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
