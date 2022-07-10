import mongoose, { Schema } from "mongoose";
import { UsersModule } from "./@types";

const userSchema = new Schema<UsersModule.UserModel>(
  {
    username: String,
    password: String,
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
