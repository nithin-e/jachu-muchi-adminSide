export type CourseListItem = {
  id: string;
  courseName: string;
  type: string;
  duration: string;
  eligibility: string;
  courseOverview: string;
  status: "Active" | "Inactive";
  image: string;
  priorityOrder?: number | null;
};

export type CoursePayload = {
  courseName?: string;
  courseOverview?: string;
  CourseOverview?: string;
  duration?: string;
  eligibility?: string;
  type?: string;
  imageUrl?: string;
  imageFile?: File | null;
  status?: "Active" | "Inactive";
  title?: string;
  body?: string;
  image?: string;
};
