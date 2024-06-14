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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import types from dotenv
const dotenv = __importStar(require("dotenv"));
// Load environment variables with type assertions
dotenv.config();
// Define the configuration object with consistent types
const config = {
    APPNAME: process.env.APPNAME || "Tempus Victor",
    NODE_ENV: process.env.NODE_ENV || "development",
    HOST: process.env.HOST || "localhost",
    PORT: (process.env.PORT && Number(process.env.PORT)) || 8080, // Ensure PORT is a number
    COOKIE_SECRET: process.env.COOKIE_SECRET || "COOKIESSSSSS",
    SECRET_STRING: process.env.SECRET_STRING || "SECRET_STRING",
    JWT_SECRET: process.env.JWT_SECRET || "JWT_secret",
};
// Export the configuration object
exports.default = config;
