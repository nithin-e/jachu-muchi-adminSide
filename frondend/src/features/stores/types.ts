export type StoreListItem = {
  id: string;
  name: string;
  description: string;
  images: string[];
  status: "Active" | "Inactive";
  address?: string;
  phone?: string;
  email?: string;
  city?: string;
  state?: string;
  zip?: string;
  image?: string;
};

export type Store = StoreListItem;

export type StoreFormData = {
  name: string;
  description: string;
  status: "Active" | "Inactive";
  address: string;
  phone: string;
  email: string;
  imageFiles: File[];
  existingImages: string[];
  city?: string;
  state?: string;
  zip?: string;
  image?: string;
};
