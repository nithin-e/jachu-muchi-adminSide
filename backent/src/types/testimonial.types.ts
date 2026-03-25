export interface CreateTestimonialInput {
  name: string;
  course: string;
  message: string;
  profileImageUrl?: string;
}

/** Omitting `profileImageUrl` keeps the existing image on update. */
export interface UpdateTestimonialInput {
  name: string;
  course: string;
  message: string;
  profileImageUrl?: string;
}
