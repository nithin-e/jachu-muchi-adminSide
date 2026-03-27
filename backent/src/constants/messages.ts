export const MESSAGES = {
  COMMON: {
    REQUIRED: (field: string) => `${field} is required`,
    INVALID: (field: string) => `Invalid ${field}`,
    NOT_FOUND: (entity: string) => `${entity} not found`,
    PAGE_POSITIVE: "page must be a positive number",
    LIMIT_POSITIVE: "limit must be a positive number",
    ORDER_ASC_DESC: "order must be 'asc' or 'desc'",
    STATUS_MUST_BE_ACTIVE_OR_INACTIVE: "Status must be Active or Inactive",
    INVALID_STATUS_VALUE: "Invalid status value",
    INVALID_TYPE_VALUE: "Invalid type value",
  },

  AUTH: {
    ALL_FIELDS_REQUIRED: "All fields required",
    USER_NOT_FOUND: "User not found",
    INVALID_PASSWORD: "Invalid password",
    ACCOUNT_INACTIVE: "Account is inactive",
  },

  ERROR: {
    INTERNAL_SERVER_ERROR: "Internal server error",
  },

  APP: {
    BACKEND_RUNNING: "Backend running 🚀",
  },

  AUTHZ: {
    INVALID_TOKEN: "Invalid or expired token",
  },

  COURSE: {
    ID_REQUIRED: "Course id is required",
    CREATED_SUCCESS: "Course created successfully",
    UPDATED_SUCCESS: "Course updated successfully",
    DELETED_SUCCESS: "Course deleted successfully",

    IMAGE_FILE_REQUIRED: "Image file is required",
    IMAGE_FILE_REQUIRED_COURSE_IMAGE: "Image file is required (field: courseImage)",
    IMAGE_UPLOADED_SUCCESS: "Course image uploaded successfully",
    IMAGE_REMOVED_SUCCESS: "Course image removed successfully",

    NAME_REQUIRED: "Course name is required",
    TYPE_REQUIRED: "Course type is required",
    DURATION_REQUIRED: "Duration is required",
    KEY_DETAILS_REQUIRED: "Key details are required",
    ELIGIBILITY_REQUIRED: "Eligibility is required",

    STATUS_MUST_BE_ACTIVE_OR_INACTIVE_LOWERCASE: "status must be Active or Inactive",

    INVALID_ID: "Invalid course id",
    NOT_FOUND: "Course not found",
    INVALID_STATUS_VALUE: "Invalid status value",
    FILTER_TYPE_STATUS_MUST_BE_ACTIVE_OR_INACTIVE: "status must be Active or Inactive",
  },

  ARTICLE: {
    ID_REQUIRED: "Article id is required",
    CREATED_SUCCESS: "Article created successfully",
    UPDATED_SUCCESS: "Article updated successfully",
    DELETED_SUCCESS: "Article deleted successfully",

    INVALID_ID: "Invalid article id",
    NOT_FOUND: "Article not found",

    TITLE_REQUIRED: "Title is required",
    DESCRIPTION_REQUIRED: "Description is required",
    VALID_DATE_REQUIRED: "Valid date is required",
    STATUS_MUST_BE_PUBLISHED_OR_DRAFT: "Status must be Published or Draft",

    INVALID_STATUS_VALUE: "Invalid status value",
    TYPE_MUST_BE_PUBLISHED_OR_DRAFT: "type must be Published or Draft",
  },

  CATEGORY: {
    ID_REQUIRED: "Category id is required",
    CREATED_SUCCESS: "Category created successfully",
    UPDATED_SUCCESS: "Category updated successfully",
    DELETED_SUCCESS: "Category deleted successfully",

    NAME_REQUIRED: "Category name is required",
    INVALID_ID: "Invalid category id",
    NOT_FOUND: "Category not found",
    DUPLICATE_NAME: "A category with this name already exists",
  },

  ENQUIRY: {
    ID_REQUIRED: "valid enquiry id is required",
    STATUS_REQUIRED: "status is required",
    NOTES_REQUIRED: "notes is required",

    STATUS_UPDATED_SUCCESS: "Enquiry status updated successfully",
    DELETED_SUCCESS: "Enquiry deleted successfully",
    NOTES_UPDATED_SUCCESS: "Enquiry notes updated successfully",

    INVALID_ID: "Invalid enquiry id",
    NOT_FOUND: "Enquiry not found",
    INVALID_STATUS_VALUE: "Invalid status value",
    TYPE_MUST_BE_VALID_ENQUIRY_TYPE: "type must be a valid enquiry type",
    INVALID_TYPE_VALUE: "Invalid type value",
  },

  TESTIMONIAL: {
    ID_REQUIRED: "Testimonial id is required",
    CREATED_SUCCESS: "Testimonial created successfully",
    UPDATED_SUCCESS: "Testimonial updated successfully",
    DELETED_SUCCESS: "Testimonial deleted successfully",

    INVALID_ID: "Invalid testimonial id",
    NOT_FOUND: "Testimonial not found",

    NAME_REQUIRED: "Name is required",
    COURSE_REQUIRED: "Course is required",
    MESSAGE_REQUIRED: "Message is required",
  },

  ALUMNI: {
    ID_REQUIRED: "Alumni id is required",
    CREATED_SUCCESS: "Alumni created successfully",
    UPDATED_SUCCESS: "Alumni updated successfully",
    DELETED_SUCCESS: "Alumni deleted successfully",

    INVALID_ID: "Invalid alumni id",
    NOT_FOUND: "Alumni not found",

    NAME_REQUIRED: "Name is required",
    ROLE_REQUIRED: "Role is required",
    COMPANY_REQUIRED: "Company is required",
  },

  BRANCH: {
    ID_REQUIRED: "Branch id is required",
    CREATED_SUCCESS: "Branch created successfully",
    UPDATED_SUCCESS: "Branch updated successfully",
    DELETED_SUCCESS: "Branch deleted successfully",

    INVALID_ID: "Invalid branch id",
    NOT_FOUND: "Branch not found",

    NAME_REQUIRED: "Branch name is required",
    LOCATION_REQUIRED: "Location is required",
    EMAIL_REQUIRED: "Email is required",
    VALID_EMAIL_REQUIRED: "Valid email is required",
    PHONE_REQUIRED: "At least one phone number is required",

    MAP_URL_REQUIRED_HTTP: "Map URL must start with http:// or https://",
    STATUS_MUST_BE_ACTIVE_OR_INACTIVE: "Status must be Active or Inactive",
    FILTER_STATUS_MUST_BE_ACTIVE_OR_INACTIVE: "status must be Active or Inactive",
  },

  BANNER: {
    ID_REQUIRED: "Banner id is required",
    CREATED_SUCCESS: "Banner created successfully",
    UPDATED_SUCCESS: "Banner updated successfully",
    DELETED_SUCCESS: "Banner deleted successfully",

    INVALID_ID: "Invalid banner id",
    NOT_FOUND: "Banner not found",

    TITLE_REQUIRED: "Title is required",
    STATUS_MUST_BE_ACTIVE_OR_INACTIVE: "Status must be Active or Inactive",

    IMAGE_REQUIRED: "Banner image is required",
  },

  USER: {
    ID_REQUIRED: "User id is required",
    CREATED_SUCCESS: "User created successfully",
    UPDATED_SUCCESS: "User updated successfully",
    DELETED_SUCCESS: "User deleted successfully",

    INVALID_ID: "Invalid user id",
    NOT_FOUND: "User not found",

    NAME_REQUIRED: "Name is required",
    EMAIL_REQUIRED: "Email is required",
    VALID_EMAIL_REQUIRED: "Valid email is required",

    PASSWORD_REQUIRED_MIN6: "Password is required (min 6 characters)",
    PASSWORD_REQUIRED_MIN6_ALT: "Password must be at least 6 characters",
    ROLE_REQUIRED: "Role must be Admin, Sub Admin, or Editor",
    STATUS_REQUIRED: "Status must be Active or Inactive",

    DUPLICATE_EMAIL: "An account with this email already exists",

    INVALID_STATUS_VALUE: "Invalid status value",
    INVALID_TYPE_VALUE: "Invalid type value",
  },

  SETTINGS: {
    SAVED_SUCCESS: "Settings saved successfully",

    INVALID_ADMIN_EMAIL_WHEN_PROVIDED:
      "Valid admin email is required when provided",
    INVALID_NOTIFICATION_EMAIL: (email: string) =>
      `Invalid notification email: ${email}`,

    PASSWORD_CHANGE_REQUIRES_ALL:
      "Password change requires userId, currentPassword, newPassword, and confirmNewPassword",
    INVALID_USER_ID: "Invalid user id",
    NEW_PASSWORD_MIN_6: "New password must be at least 6 characters",
    PASSWORDS_DO_NOT_MATCH: "New password and confirmation do not match",
    CURRENT_PASSWORD_INCORRECT: "Current password is incorrect",
  },

  GALLERY: {
    INVALID_PAGE: "Invalid page",
    INVALID_LIMIT: "Invalid limit",
    ID_REQUIRED: "Gallery id is required",
    INVALID_ID: "Invalid gallery id",
    NOT_FOUND: "Gallery not found",
    DELETED_SUCCESS: "Gallery deleted successfully",
  },
} as const;

// Optional type export for consumers
export type MessagesType = typeof MESSAGES;

