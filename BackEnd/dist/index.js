"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import statements, ensuring types are imported as well (if available)
const server_1 = __importDefault(require("./server"));
const config_1 = __importDefault(require("./config"));
const error_middleware_1 = require("./middlewares/error.middleware");
server_1.default.listen(process.env.PORT, () => {
    console.log(`Server ${config_1.default.APPNAME} running on port ${config_1.default.PORT}, http://localhost:${config_1.default.PORT}/`);
});
server_1.default.use(error_middleware_1.errorHandler);
