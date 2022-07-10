import express from "express";
import mongoose from "mongoose";
import { Controllers } from "./controllers";
import { User } from "./modules/users/UserDAL";

export const app = express();

app.use(Controllers);

export const main = async () => {
  await mongoose.connect("mongodb://root:example@mongo:27017", {
    dbName: "tinypost",
  });

  app.listen(3000);
};
