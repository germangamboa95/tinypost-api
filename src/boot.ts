import express from "express";
import { Controllers } from "./controllers";

export const app = express();

app.use(Controllers);

export const main = () => {
  app.listen(3000);
};
