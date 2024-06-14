// Import types from dotenv
import * as dotenv from "dotenv";

// Define a configuration interface for type safety
interface AppConfig {
  APPNAME: string;
  NODE_ENV: string;
  HOST: string;
  PORT: number;
  COOKIE_SECRET: string;
  SECRET_STRING: string;
  JWT_SECRET: string;
}

// Load environment variables with type assertions
dotenv.config();

// Define the configuration object with consistent types
const config: AppConfig = {
  APPNAME: process.env.APPNAME || "Tempus Victor",
  NODE_ENV: process.env.NODE_ENV || "development",
  HOST: process.env.HOST || "localhost",
  PORT: (process.env.PORT && Number(process.env.PORT)) || 8080, // Ensure PORT is a number
  COOKIE_SECRET: process.env.COOKIE_SECRET || "COOKIESSSSSS",
  SECRET_STRING: process.env.SECRET_STRING || "SECRET_STRING",
  JWT_SECRET: process.env.JWT_SECRET || "JWT_secret",
};

// Export the configuration object
export default config;
