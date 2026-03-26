"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_injection_1 = require("../config/injections/auth.injection");
const auth_validator_1 = require("../validators/auth.validator");
const request_validator_1 = require("../validators/request.validator");
const router = (0, express_1.Router)();
router.post("/login", auth_validator_1.validateLogin, request_validator_1.handleValidation, auth_injection_1.authController.login.bind(auth_injection_1.authController));
exports.default = router;
