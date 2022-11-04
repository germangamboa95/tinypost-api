import jwt from "jsonwebtoken";
import { IUser } from "../models/User";

const TOKEN_SECRET = "cookies";

export class AuthService {
  public static async validateToken(token: string) {
    const decoded_token = jwt.verify(token, TOKEN_SECRET);

    if (typeof decoded_token === "string") {
      throw new Error("Decoded Token is string.");
    }

    if (decoded_token.sub === undefined) {
      throw new Error("Decoded Sub is missing.");
    }

    return decoded_token.sub;
  }

  public static async generateToken(user: IUser) {
    return jwt.sign(
      {
        sub: user._id,
        username: user.username,
      },
      TOKEN_SECRET,
      { expiresIn: "12hr" }
    );
  }
}
