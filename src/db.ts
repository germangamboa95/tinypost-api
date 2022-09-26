import "reflect-metadata";
import path = require("path");
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Post } from "./entity/Post";
import { Tag } from "./entity/Tag";

export const data_source = new DataSource({
  type: "sqlite",
  database: path.join(__dirname, "/../dev.sqlite3"),
  entities: [User, Post, Tag],
  synchronize: true,
});

export const data_source_test = new DataSource({
  type: "sqlite",
  database: ":memory:",
  entities: [User, Post, Tag],
  synchronize: true,
});
