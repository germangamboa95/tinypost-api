import { NightwatchTests } from "nightwatch";

const Ecosia: NightwatchTests = {
  "demo test": () => {
    browser
      .url("https://www.ecosia.org/")
      .setValue("input[type=search]", "nightwatch")
      .click("button[type=submit]")
      .assert.containsText(".mainline-results", "Nightwatch.js")
      .end();
  },
};

export default Ecosia;
