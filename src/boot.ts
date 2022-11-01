import { Controllers } from "./controllers";
import { app } from "./web";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

export const main = async () => {
  app.use(Controllers);

  await mongoose.connect("mongodb://mongo:27017", {
    auth: {
      username: "root",
      password: "example",
    },
    dbName: "tinypost_dev",
  });

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err?.message });
  });

  app.get("*", (req: Request, res: Response) => {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "Resource not found",
    });
  });

  app.listen(3000);
};
