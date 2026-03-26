import { body, param } from "express-validator";
import {
  ADMIN_USER_ROLE_VALUES,
  ADMIN_USER_STATUS_VALUES,
} from "../models/User";
import { MESSAGES } from "../constants/messages";

export const validateUserIdParam = [
  param("id").isMongoId().withMessage(MESSAGES.USER.INVALID_ID),
];

export const validateCreateUser = [
  body("name").trim().notEmpty().withMessage(MESSAGES.USER.NAME_REQUIRED),
  body("email")
    .trim()
    .notEmpty()
    .withMessage(MESSAGES.USER.EMAIL_REQUIRED)
    .bail()
    .isEmail()
    .withMessage(MESSAGES.USER.VALID_EMAIL_REQUIRED),
  body("password")
    .notEmpty()
    .withMessage(MESSAGES.USER.PASSWORD_REQUIRED_MIN6)
    .bail()
    .isLength({ min: 6 })
    .withMessage(MESSAGES.USER.PASSWORD_REQUIRED_MIN6_ALT),
  body("role")
    .trim()
    .isIn([...ADMIN_USER_ROLE_VALUES])
    .withMessage(MESSAGES.USER.ROLE_REQUIRED),
  body("status")
    .trim()
    .isIn([...ADMIN_USER_STATUS_VALUES])
    .withMessage(MESSAGES.USER.STATUS_REQUIRED),
];

export const validateUpdateUser = [
  body("name").trim().notEmpty().withMessage(MESSAGES.USER.NAME_REQUIRED),
  body("email")
    .trim()
    .notEmpty()
    .withMessage(MESSAGES.USER.EMAIL_REQUIRED)
    .bail()
    .isEmail()
    .withMessage(MESSAGES.USER.VALID_EMAIL_REQUIRED),
  body("role")
    .trim()
    .isIn([...ADMIN_USER_ROLE_VALUES])
    .withMessage(MESSAGES.USER.ROLE_REQUIRED),
  body("status")
    .trim()
    .isIn([...ADMIN_USER_STATUS_VALUES])
    .withMessage(MESSAGES.USER.STATUS_REQUIRED),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage(MESSAGES.USER.PASSWORD_REQUIRED_MIN6_ALT),
];
