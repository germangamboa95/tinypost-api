import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { data_source } from "../db";
import { getValidatedData, validate } from "./middleware/Validation";
import { StatusCodes } from "http-status-codes";
import { User } from "../entity/User";
import { BasicAuthenticationService } from "../services/BasicAuthenticationService";
import { FindUserService } from "../services/FindUserService";
import { UserDoesNotExist } from "../errors/UserDoesNotExist";
import { InvalidPassword } from "../errors/InvalidPassword";

export const AuthController = Router();

const find_user_service = new FindUserService(data_source);

const LoginResponse = (user: User, token: string) => {
  const formatted_user = {
    id: user.id,
    email: user.email,
    created_at: user.created_at,
    updated_at: user.update_at,
  };

  return {
    user: formatted_user,
    jwt: token,
  };
};

AuthController.post(
  "/login",
  validate([
    body("email").isEmail().trim(),
    body("password").isString().trim(),
  ]),
  async (req: Request, res: Response) => {
    const { email, password } = getValidatedData(req);

    try {
      const user = await find_user_service.findByEmail(email);

      if (user === null) {
        throw new UserDoesNotExist();
      }

      const auth_service = new BasicAuthenticationService(user);

      const password_is_valid = await auth_service.check(password);

      if (!password_is_valid) {
        throw new InvalidPassword();
      }

      const token = await auth_service.makeToken();

      return res.json(LoginResponse(user, token));
    } catch (error) {
      if (
        error instanceof UserDoesNotExist ||
        error instanceof InvalidPassword
      ) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Invalid Credentials",
        });
      }
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
);
