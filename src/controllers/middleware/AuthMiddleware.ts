import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { TokenExpiredError } from "jsonwebtoken";
import { AuthService } from "../../services/AuthService";
import { UserService } from "../../services/UserService";

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Authentication Token Missing",
    });
  }

  try {
    const user_id = await AuthService.validateToken(token.split(" ")[1]);

    res.locals.user = await UserService.getById(user_id);
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Token expired" });
    }
    return next(error);
  }

  return next();
};
