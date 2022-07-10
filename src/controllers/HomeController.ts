import { Router } from "express";

export const HomeController = Router();

HomeController.get("/", (req, res) => {
  return res.send("Hello worlds");
});
