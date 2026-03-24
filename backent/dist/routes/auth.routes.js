"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dependency_injection_1 = require("../config/dependency-injection");
const router = (0, express_1.Router)();
router.post("/login", dependency_injection_1.authController.login);
exports.default = router;
