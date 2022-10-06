import { NextFunction, Response, Request } from "express";
import { FindUserService } from "../../services/FindUserService";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { data_source } from "../../db";

const find_user_service = new FindUserService(data_source);

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Authentication Token Missing",
    });
  }

  try {
    // @ts-ignore
    const { email } = jwt.verify(
      String(token.split(" ")[1]),
      String("testicles")
    );
    res.locals.user = await find_user_service.findByEmail(email);
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    }
    return next(error);
  }

  return next();
};
