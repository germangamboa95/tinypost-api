import { Schema, model, Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;

  username: string;
  password: string;
}

const user_schema = new Schema<IUser>(
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

export const User = model<IUser>("User", user_schema);
