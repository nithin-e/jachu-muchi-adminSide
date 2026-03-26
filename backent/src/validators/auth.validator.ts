import { body } from "express-validator";
import { MESSAGES } from "../constants/messages";

export const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage(MESSAGES.AUTH.ALL_FIELDS_REQUIRED)
    .bail()
    .isEmail()
    .withMessage(MESSAGES.USER.VALID_EMAIL_REQUIRED),
  body("password")
    .notEmpty()
    .withMessage(MESSAGES.AUTH.ALL_FIELDS_REQUIRED)
    .bail()
    .isLength({ min: 6 })
    .withMessage(MESSAGES.USER.PASSWORD_REQUIRED_MIN6_ALT),
];
