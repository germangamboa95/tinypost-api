"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const controllers_1 = require("./controllers");
const web_1 = require("./web");
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_codes_1 = require("http-status-codes");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    web_1.app.use(controllers_1.VIEW_CONTROLLERS);
    web_1.app.use("/api", controllers_1.API_CONTROLLERS);
    yield mongoose_1.default.connect("mongodb://mongo:27017", {
        auth: {
            username: "root",
            password: "example",
        },
        dbName: "tinypost_dev",
    });
    web_1.app.use((err, req, res, next) => {
        console.log(err);
        return res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: err === null || err === void 0 ? void 0 : err.message });
    });
    web_1.app.get("*", (req, res) => {
        return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
            message: "Resource not found",
        });
    });
    web_1.app.listen(3000, () => console.log("app started"));
});
exports.main = main;
