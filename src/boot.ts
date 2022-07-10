import express from "express";
import { engine } from "express-handlebars";
import mongoose from "mongoose";
import { Controllers } from "./controllers";

export const app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(Controllers);

export const main = async () => {
  await mongoose.connect("mongodb://root:example@mongo:27017", {
    dbName: "tinypost",
  });

  app.listen(3000);
};
