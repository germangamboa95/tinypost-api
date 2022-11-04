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
exports.HomeController = void 0;
const express_1 = require("express");
const constants_1 = require("../constants");
const PostService_1 = require("../services/PostService");
exports.HomeController = (0, express_1.Router)();
exports.HomeController.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield PostService_1.PostService.list();
    console.log(posts);
    return res.render(constants_1.HOME_PAGE, {
        posts,
    });
}));
