"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeController = void 0;
const express_1 = require("express");
const constants_1 = require("../constants");
exports.HomeController = (0, express_1.Router)();
exports.HomeController.get("/", (req, res) => {
    return res.render(constants_1.HOME_PAGE);
});
