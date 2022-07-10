import mongoose from "mongoose";
import { Controllers } from "./controllers";
import { app } from "./web";

export const main = async () => {
  app.use(Controllers);
  await mongoose.connect("mongodb://root:example@mongo:27017", {
    dbName: "tinypost",
  });

  app.listen(3000);
};
