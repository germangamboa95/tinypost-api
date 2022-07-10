"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ecosia = {
    "demo test": () => {
        browser
            .url("https://www.ecosia.org/")
            .setValue("input[type=search]", "nightwatch")
            .click("button[type=submit]")
            .assert.containsText(".mainline-results", "Nightwatch.js")
            .end();
    },
};
exports.default = Ecosia;
