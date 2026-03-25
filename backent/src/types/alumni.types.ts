export interface CreateAlumniInput {
  name: string;
  role: string;
  company: string;
  profileImageUrl?: string;
}

/** Omitting `profileImageUrl` keeps the existing image on update. */
export interface UpdateAlumniInput {
  name: string;
  role: string;
  company: string;
  profileImageUrl?: string;
}
