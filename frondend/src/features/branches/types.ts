export type BranchStatus = "Active" | "Inactive";

export interface Branch {
  id: string;
  name: string;
  phones: string[];
  email: string;
  location: string;
  mapUrl: string;
  status: BranchStatus;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}
