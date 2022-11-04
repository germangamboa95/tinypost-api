import { UserAlreadyExists } from "../errors/UserAlreadyExists";
import { User } from "../models";
import bcryptjs from "bcryptjs";
import { UserDoesNotExist } from "../errors/UserDoesNotExist";
import { InvalidPassword } from "../errors/InvalidPassword";
export class UserService {
  public static async getById(user_id: string) {
    const user = await User.findById(user_id);

    if (!user) {
      throw new UserDoesNotExist();
    }

    return user;
  }

  public static async register(username: string, password: string) {
    const existing_user = await User.findOne({ username });

    if (existing_user) {
      throw new UserAlreadyExists();
    }

    const hashed_password = await bcryptjs.hash(password, 10);

    return User.create({
      username,
      password: hashed_password,
    });
  }

  public static async authenticate(username: string, password: string) {
    const user = await User.findOne({ username });

    if (!user) {
      throw new UserDoesNotExist();
    }

    const is_valid_password = await bcryptjs.compare(password, user.password);

    if (!is_valid_password) {
      throw new InvalidPassword();
    }

    return user;
  }
}
