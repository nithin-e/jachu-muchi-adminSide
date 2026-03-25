import { BranchStatus } from "../models/Branch";

export interface CreateBranchInput {
  name: string;
  location: string;
  phoneNumbers: string[];
  mapUrl: string;
  email: string;
  status: BranchStatus;
}

export interface UpdateBranchInput {
  name: string;
  location: string;
  phoneNumbers: string[];
  mapUrl: string;
  email: string;
  status: BranchStatus;
}
