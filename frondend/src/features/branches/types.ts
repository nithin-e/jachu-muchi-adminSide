export type BranchStatus = "Active" | "Inactive";

export interface Branch {
  id: string;
  name: string;
  location: string;
  phoneNumbers: string[];
  mapUrl: string;
  email: string;
  status: BranchStatus;
}
