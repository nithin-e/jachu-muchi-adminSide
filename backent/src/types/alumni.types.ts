export interface CreateAlumniInput {
  name: string;
  role: string;
  company: string;
  place: string;
  profileImageUrl?: string;
}

/** Omitting `profileImageUrl` keeps the existing image on update. */
export interface UpdateAlumniInput {
  name: string;
  role: string;
  company: string;
  place: string;
  profileImageUrl?: string;
}
