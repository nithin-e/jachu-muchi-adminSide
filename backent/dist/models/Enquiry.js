"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnquiryModel = exports.ENQUIRY_TYPE_VALUES = exports.ENQUIRY_STATUS_VALUES = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.ENQUIRY_STATUS_VALUES = [
    "New",
    "Contacted",
    "Interested",
    "Converted",
    "Closed",
];
exports.ENQUIRY_TYPE_VALUES = [
    "Course Enquiry",
    "Normal Enquiry",
];
const enquirySchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    course: { type: String, required: true, trim: true },
    email: { type: String, default: "", trim: true },
    message: { type: String, default: "", trim: true },
    type: {
        type: String,
        enum: exports.ENQUIRY_TYPE_VALUES,
        default: "Course Enquiry",
    },
    status: {
        type: String,
        enum: exports.ENQUIRY_STATUS_VALUES,
        default: "New",
    },
    notes: { type: String, default: "", trim: true },
}, { timestamps: true });
exports.EnquiryModel = mongoose_1.default.model("enquiries", enquirySchema);
