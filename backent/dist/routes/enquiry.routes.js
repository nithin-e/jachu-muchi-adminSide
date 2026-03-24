"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const enquiry_controller_1 = require("../controllers/enquiry.controller");
const dependency_injection_1 = require("../config/dependency-injection");
const router = (0, express_1.Router)();
router.get("/enquiries", enquiry_controller_1.getAllEnquiries);
router.patch("/enquiries/:id/status", dependency_injection_1.enquiryController.updateStatus);
exports.default = router;
