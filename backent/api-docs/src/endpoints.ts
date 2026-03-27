export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiFieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "boolean"
  | "select"
  | "textarea";

export interface ApiField {
  key: string;
  label: string;
  type: ApiFieldType;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  options?: string[];
}

export interface ApiEndpoint {
  id: string;
  module: string;
  method: HttpMethod;
  path: string;
  description: string;
  protected: boolean;
  params?: ApiField[];
  query?: ApiField[];
  headers?: ApiField[];
  body?: ApiField[];
  note?: string;
}

const AUTH_HEADER: ApiField[] = [
  {
    key: "Authorization",
    label: "Authorization",
    type: "text",
    placeholder: "Bearer <token>",
  },
];

const FILTER_QUERY: ApiField[] = [
  { key: "page", label: "Page", type: "number", placeholder: "1", defaultValue: "1" },
  { key: "limit", label: "Limit", type: "number", placeholder: "10", defaultValue: "10" },
  { key: "search", label: "Search", type: "text", placeholder: "keyword" },
  { key: "sortBy", label: "Sort By", type: "text", placeholder: "createdAt" },
  {
    key: "order",
    label: "Order",
    type: "select",
    options: ["asc", "desc"],
    defaultValue: "desc",
  },
];

const ID_PARAM: ApiField[] = [{ key: "id", label: "ID", type: "text", required: true }];

const USER_BODY_COMMON: ApiField[] = [
  { key: "name", label: "Name", type: "text", required: true },
  { key: "email", label: "Email", type: "email", required: true },
  {
    key: "role",
    label: "Role",
    type: "select",
    required: true,
    options: ["Admin", "Sub Admin", "Editor"],
    defaultValue: "Admin",
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    required: true,
    options: ["Active", "Inactive"],
    defaultValue: "Active",
  },
];

const COURSE_BODY_COMMON: ApiField[] = [
  { key: "name", label: "Name", type: "text", required: true },
  { key: "type", label: "Type", type: "text", required: true },
  { key: "duration", label: "Duration", type: "text", required: true },
  { key: "keyDetails", label: "Key Details", type: "textarea", required: true },
  { key: "eligibility", label: "Eligibility", type: "textarea", required: true },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: ["Active", "Inactive"],
    defaultValue: "Active",
  },
  { key: "imageUrl", label: "Image URL", type: "text" },
];

const ARTICLE_BODY_COMMON: ApiField[] = [
  { key: "title", label: "Title", type: "text", required: true },
  { key: "description", label: "Description", type: "textarea", required: true },
  {
    key: "articleDate",
    label: "Article Date",
    type: "text",
    placeholder: "YYYY-MM-DD",
    required: true,
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: ["Published", "Draft"],
    defaultValue: "Draft",
  },
  { key: "imageUrl", label: "Image URL", type: "text" },
];

const CATEGORY_BODY_COMMON: ApiField[] = [
  { key: "name", label: "Name", type: "text", required: true },
];

const TESTIMONIAL_BODY_COMMON: ApiField[] = [
  { key: "name", label: "Name", type: "text", required: true },
  { key: "course", label: "Course", type: "text", required: true },
  { key: "message", label: "Message", type: "textarea", required: true },
  { key: "profileImageUrl", label: "Profile Image URL", type: "text" },
];

const ALUMNI_BODY_COMMON: ApiField[] = [
  { key: "name", label: "Name", type: "text", required: true },
  { key: "role", label: "Role", type: "text", required: true },
  { key: "company", label: "Company", type: "text", required: true },
  { key: "profileImageUrl", label: "Profile Image URL", type: "text" },
];

const BRANCH_BODY_COMMON: ApiField[] = [
  { key: "name", label: "Name", type: "text", required: true },
  { key: "location", label: "Location", type: "text", required: true },
  { key: "email", label: "Email", type: "email", required: true },
  { key: "mapUrl", label: "Map URL", type: "text" },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: ["Active", "Inactive"],
    defaultValue: "Active",
  },
  {
    key: "phoneNumbers",
    label: "Phone Numbers (comma separated)",
    type: "text",
    required: true,
    placeholder: "9876543210,9123456780",
  },
];

const BANNER_BODY_COMMON: ApiField[] = [
  { key: "title", label: "Title", type: "text", required: true },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: ["Active", "Inactive"],
    defaultValue: "Active",
  },
  { key: "imageUrl", label: "Image URL", type: "text", required: true },
];

const SETTINGS_BODY_COMMON: ApiField[] = [
  { key: "whatsAppNumber", label: "WhatsApp Number", type: "text" },
  { key: "adminEmail", label: "Admin Email", type: "email" },
  {
    key: "notificationEmails",
    label: "Notification Emails (comma separated)",
    type: "text",
  },
];

export const API_ENDPOINTS: ApiEndpoint[] = [
  { id: "health", module: "system", method: "GET", path: "/", description: "Health check", protected: false },

  {
    id: "auth-login",
    module: "auth",
    method: "POST",
    path: "/api/auth/login",
    description: "Login admin user",
    protected: false,
    body: [
      { key: "email", label: "Email", type: "email", required: true },
      { key: "password", label: "Password", type: "password", required: true },
    ],
  },

  { id: "enquiry-list", module: "enquiries", method: "GET", path: "/api/enquiries/", description: "List enquiries", protected: true, headers: AUTH_HEADER },
  { id: "enquiry-filter", module: "enquiries", method: "GET", path: "/api/enquiries/filter", description: "Filter enquiries", protected: true, headers: AUTH_HEADER, query: FILTER_QUERY },
  {
    id: "enquiry-update-status",
    module: "enquiries",
    method: "PATCH",
    path: "/api/enquiries/:id/status",
    description: "Update enquiry status",
    protected: true,
    headers: AUTH_HEADER,
    params: ID_PARAM,
    body: [{ key: "status", label: "Status", type: "text", required: true }],
  },
  { id: "enquiry-delete", module: "enquiries", method: "DELETE", path: "/api/enquiries/:id", description: "Delete enquiry", protected: true, headers: AUTH_HEADER, params: ID_PARAM },
  { id: "enquiry-get-by-id", module: "enquiries", method: "GET", path: "/api/enquiries/:id", description: "Get enquiry by id", protected: true, headers: AUTH_HEADER, params: ID_PARAM },
  {
    id: "enquiry-update-notes",
    module: "enquiries",
    method: "PATCH",
    path: "/api/enquiries/:id/notes",
    description: "Update enquiry notes",
    protected: true,
    headers: AUTH_HEADER,
    params: ID_PARAM,
    body: [{ key: "notes", label: "Notes", type: "textarea", required: true }],
  },

  { id: "course-list-all", module: "courses", method: "GET", path: "/api/courses/all", description: "List all courses (initial load)", protected: true, headers: AUTH_HEADER },
  {
    id: "course-filter",
    module: "courses",
    method: "GET",
    path: "/api/courses/filter",
    description: "Filter courses",
    protected: true,
    headers: AUTH_HEADER,
    query: [...FILTER_QUERY, { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"] }, { key: "type", label: "Type", type: "text" }],
  },
  { id: "course-create", module: "courses", method: "POST", path: "/api/courses/", description: "Create course", protected: true, headers: AUTH_HEADER, body: COURSE_BODY_COMMON },
  {
    id: "course-upload-image",
    module: "courses",
    method: "PATCH",
    path: "/api/courses/:id/image",
    description: "Upload course image",
    protected: true,
    headers: AUTH_HEADER,
    params: ID_PARAM,
    note: "This endpoint expects multipart file upload (`courseImage`).",
  },
  { id: "course-update", module: "courses", method: "PUT", path: "/api/courses/:id", description: "Update course", protected: true, headers: AUTH_HEADER, params: ID_PARAM, body: COURSE_BODY_COMMON },
  { id: "course-delete", module: "courses", method: "DELETE", path: "/api/courses/:id", description: "Delete course", protected: true, headers: AUTH_HEADER, params: ID_PARAM },

  { id: "article-list-all", module: "articles", method: "GET", path: "/api/articles/all", description: "List all articles (initial load)", protected: true, headers: AUTH_HEADER },
  {
    id: "article-filter",
    module: "articles",
    method: "GET",
    path: "/api/articles/filter",
    description: "Filter articles",
    protected: true,
    headers: AUTH_HEADER,
    query: [...FILTER_QUERY, { key: "status", label: "Status", type: "select", options: ["Published", "Draft"] }],
  },
  { id: "article-stats", module: "articles", method: "GET", path: "/api/articles/stats", description: "Article stats", protected: true, headers: AUTH_HEADER },
  { id: "article-list", module: "articles", method: "GET", path: "/api/articles/", description: "Paginated article list", protected: true, headers: AUTH_HEADER },
  { id: "article-get-by-id", module: "articles", method: "GET", path: "/api/articles/:id", description: "Get article by id", protected: true, headers: AUTH_HEADER, params: ID_PARAM },
  { id: "article-create", module: "articles", method: "POST", path: "/api/articles/", description: "Create article", protected: true, headers: AUTH_HEADER, body: ARTICLE_BODY_COMMON },
  { id: "article-update", module: "articles", method: "PUT", path: "/api/articles/:id", description: "Update article", protected: true, headers: AUTH_HEADER, params: ID_PARAM, body: ARTICLE_BODY_COMMON },
  { id: "article-delete", module: "articles", method: "DELETE", path: "/api/articles/:id", description: "Delete article", protected: true, headers: AUTH_HEADER, params: ID_PARAM },

  { id: "category-list-all", module: "categories", method: "GET", path: "/api/categories/all", description: "List all categories (initial load)", protected: true, headers: AUTH_HEADER },
  { id: "category-filter", module: "categories", method: "GET", path: "/api/categories/filter", description: "Filter categories", protected: true, headers: AUTH_HEADER, query: FILTER_QUERY },
  { id: "category-create", module: "categories", method: "POST", path: "/api/categories/", description: "Create category", protected: true, headers: AUTH_HEADER, body: CATEGORY_BODY_COMMON },
  { id: "category-update", module: "categories", method: "PUT", path: "/api/categories/:id", description: "Update category", protected: true, headers: AUTH_HEADER, params: ID_PARAM, body: CATEGORY_BODY_COMMON },
  { id: "category-delete", module: "categories", method: "DELETE", path: "/api/categories/:id", description: "Delete category", protected: true, headers: AUTH_HEADER, params: ID_PARAM },

  { id: "gallery-all", module: "gallery", method: "GET", path: "/api/gallery/all", description: "Gallery initial list", protected: true, headers: AUTH_HEADER },
  { id: "gallery-filter", module: "gallery", method: "GET", path: "/api/gallery/filter", description: "Filter gallery", protected: true, headers: AUTH_HEADER, query: FILTER_QUERY },
  { id: "gallery-delete", module: "gallery", method: "DELETE", path: "/api/gallery/:id", description: "Delete gallery item", protected: true, headers: AUTH_HEADER, params: ID_PARAM },

  { id: "testimonial-list-all", module: "testimonials", method: "GET", path: "/api/testimonials/all", description: "List all testimonials (initial load)", protected: true, headers: AUTH_HEADER },
  { id: "testimonial-list", module: "testimonials", method: "GET", path: "/api/testimonials/", description: "Paginated testimonial list", protected: true, headers: AUTH_HEADER },
  { id: "testimonial-filter", module: "testimonials", method: "GET", path: "/api/testimonials/filter", description: "Filter testimonials", protected: true, headers: AUTH_HEADER, query: FILTER_QUERY },
  { id: "testimonial-get-by-id", module: "testimonials", method: "GET", path: "/api/testimonials/:id", description: "Get testimonial by id", protected: true, headers: AUTH_HEADER, params: ID_PARAM },
  { id: "testimonial-create", module: "testimonials", method: "POST", path: "/api/testimonials/", description: "Create testimonial", protected: true, headers: AUTH_HEADER, body: TESTIMONIAL_BODY_COMMON },
  { id: "testimonial-update", module: "testimonials", method: "PUT", path: "/api/testimonials/:id", description: "Update testimonial", protected: true, headers: AUTH_HEADER, params: ID_PARAM, body: TESTIMONIAL_BODY_COMMON },
  { id: "testimonial-delete", module: "testimonials", method: "DELETE", path: "/api/testimonials/:id", description: "Delete testimonial", protected: true, headers: AUTH_HEADER, params: ID_PARAM },

  { id: "alumni-list-all", module: "alumni", method: "GET", path: "/api/alumni/all", description: "List all alumni (initial load)", protected: true, headers: AUTH_HEADER },
  { id: "alumni-filter", module: "alumni", method: "GET", path: "/api/alumni/filter", description: "Filter alumni", protected: true, headers: AUTH_HEADER, query: FILTER_QUERY },
  { id: "alumni-create", module: "alumni", method: "POST", path: "/api/alumni/", description: "Create alumni", protected: true, headers: AUTH_HEADER, body: ALUMNI_BODY_COMMON },
  { id: "alumni-update", module: "alumni", method: "PUT", path: "/api/alumni/:id", description: "Update alumni", protected: true, headers: AUTH_HEADER, params: ID_PARAM, body: ALUMNI_BODY_COMMON },
  { id: "alumni-delete", module: "alumni", method: "DELETE", path: "/api/alumni/:id", description: "Delete alumni", protected: true, headers: AUTH_HEADER, params: ID_PARAM },

  { id: "branch-list-all", module: "branches", method: "GET", path: "/api/branches/all", description: "List all branches (initial load)", protected: true, headers: AUTH_HEADER },
  { id: "branch-filter", module: "branches", method: "GET", path: "/api/branches/filter", description: "Filter branches", protected: true, headers: AUTH_HEADER, query: FILTER_QUERY },
  { id: "branch-get-by-id", module: "branches", method: "GET", path: "/api/branches/:id", description: "Get branch by id", protected: true, headers: AUTH_HEADER, params: ID_PARAM },
  { id: "branch-create", module: "branches", method: "POST", path: "/api/branches/", description: "Create branch", protected: true, headers: AUTH_HEADER, body: BRANCH_BODY_COMMON },
  { id: "branch-update", module: "branches", method: "PUT", path: "/api/branches/:id", description: "Update branch", protected: true, headers: AUTH_HEADER, params: ID_PARAM, body: BRANCH_BODY_COMMON },
  { id: "branch-delete", module: "branches", method: "DELETE", path: "/api/branches/:id", description: "Delete branch", protected: true, headers: AUTH_HEADER, params: ID_PARAM },

  { id: "banner-list-all", module: "banners", method: "GET", path: "/api/banners/all", description: "List all banners (initial load)", protected: true, headers: AUTH_HEADER },
  { id: "banner-list", module: "banners", method: "GET", path: "/api/banners/", description: "Paginated banner list", protected: true, headers: AUTH_HEADER },
  { id: "banner-get-by-id", module: "banners", method: "GET", path: "/api/banners/:id", description: "Get banner by id", protected: true, headers: AUTH_HEADER, params: ID_PARAM },
  { id: "banner-create", module: "banners", method: "POST", path: "/api/banners/", description: "Create banner", protected: true, headers: AUTH_HEADER, body: BANNER_BODY_COMMON },
  { id: "banner-update", module: "banners", method: "PUT", path: "/api/banners/:id", description: "Update banner", protected: true, headers: AUTH_HEADER, params: ID_PARAM, body: BANNER_BODY_COMMON },
  { id: "banner-delete", module: "banners", method: "DELETE", path: "/api/banners/:id", description: "Delete banner", protected: true, headers: AUTH_HEADER, params: ID_PARAM },

  { id: "user-list-all", module: "users", method: "GET", path: "/api/users/all", description: "List all users (initial load)", protected: true, headers: AUTH_HEADER },
  { id: "user-filter", module: "users", method: "GET", path: "/api/users/filter", description: "Filter users", protected: true, headers: AUTH_HEADER, query: [...FILTER_QUERY, { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"] }, { key: "type", label: "Role", type: "select", options: ["Admin", "Sub Admin", "Editor"] }] },
  { id: "user-list", module: "users", method: "GET", path: "/api/users/", description: "Paginated user list", protected: true, headers: AUTH_HEADER },
  { id: "user-get-by-id", module: "users", method: "GET", path: "/api/users/:id", description: "Get user by id", protected: true, headers: AUTH_HEADER, params: ID_PARAM },
  { id: "user-create", module: "users", method: "POST", path: "/api/users/", description: "Create user", protected: true, headers: AUTH_HEADER, body: [...USER_BODY_COMMON, { key: "password", label: "Password", type: "password", required: true }] },
  { id: "user-update", module: "users", method: "PUT", path: "/api/users/:id", description: "Update user", protected: true, headers: AUTH_HEADER, params: ID_PARAM, body: [...USER_BODY_COMMON, { key: "password", label: "Password (optional)", type: "password" }] },
  { id: "user-delete", module: "users", method: "DELETE", path: "/api/users/:id", description: "Delete user", protected: true, headers: AUTH_HEADER, params: ID_PARAM },

  { id: "settings-get", module: "settings", method: "GET", path: "/api/settings/", description: "Get settings", protected: true, headers: AUTH_HEADER },
  { id: "settings-save", module: "settings", method: "PUT", path: "/api/settings/", description: "Save settings", protected: true, headers: AUTH_HEADER, body: SETTINGS_BODY_COMMON },
];
