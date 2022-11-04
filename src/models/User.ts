import { Schema, model, InferSchemaType } from "mongoose";

const user_schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export type IUser = InferSchemaType<typeof user_schema>;

export const User = model<IUser>("User", user_schema);
