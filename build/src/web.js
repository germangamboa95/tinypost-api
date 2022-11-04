"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const express_handlebars_1 = require("express-handlebars");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.engine("handlebars", (0, express_handlebars_1.engine)());
exports.app.set("view engine", "handlebars");
exports.app.set("views", "./views");
