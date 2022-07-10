"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = void 0;
const render = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div;
};
exports.render = render;
