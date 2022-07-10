"use strict";
/**
 * @jest-environment jsdom
 */
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
const supertest_1 = __importDefault(require("supertest"));
const web_1 = require("../../web");
const HomeController_1 = require("../HomeController");
const dom_1 = require("@testing-library/dom");
const renderUtility_1 = require("./renderUtility");
web_1.app.use(HomeController_1.HomeController);
describe("HomeController Suite", () => {
    it("has a root route", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(web_1.app).get("/");
        expect(response.statusCode).toBe(200);
    }));
    it("returns home page", () => __awaiter(void 0, void 0, void 0, function* () {
        const { text } = yield (0, supertest_1.default)(web_1.app).get("/");
        const container = (0, renderUtility_1.render)(text);
        const title = (0, dom_1.getByText)(container, "Tinypost");
        expect(title.textContent).toBe("Tinypost");
    }));
});
