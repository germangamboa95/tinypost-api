import { UserActions } from "./@types";
import { User } from "./UserDAL";
import bcrypt from "bcryptjs";

export const createUser: UserActions.CreateUser = async (user_dto) => {
  return await User.create({
    username: user_dto.username,
    password: await bcrypt.hash(user_dto.password, 10),
  });
};

export const findUserByUsername: UserActions.FindUserByUsername = async (
  username: string
) => {
  return User.findOne({
    username,
  });
};
