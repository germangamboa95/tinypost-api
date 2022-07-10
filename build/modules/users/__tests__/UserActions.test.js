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
Object.defineProperty(exports, "__esModule", { value: true });
const UserActions_1 = require("../UserActions");
const UserDAL_1 = require("../UserDAL");
jest.mock("../UserDAL");
describe("UserActions Suite", () => {
    it("can create a user with hashed password", () => __awaiter(void 0, void 0, void 0, function* () {
        const model_spy = jest.spyOn(UserDAL_1.User, "create");
        yield (0, UserActions_1.createUser)({
            username: "testicle",
            password: "testicles",
        });
        expect(model_spy).toBeCalledTimes(1);
    }));
    it("can find a user by username", () => __awaiter(void 0, void 0, void 0, function* () {
        const model_spy = jest.spyOn(UserDAL_1.User, "findOne");
        yield (0, UserActions_1.findUserByUsername)("testicle");
        expect(model_spy).toBeCalledTimes(1);
    }));
});
