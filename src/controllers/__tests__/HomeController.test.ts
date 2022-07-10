import request from "supertest";
import { HomeController } from "../HomeController";

import express from "express";

const app = express();

app.use(HomeController);

describe("HomeController Suite", () => {
  it("has a root route", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });
});
