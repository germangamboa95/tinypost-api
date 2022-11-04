import { Request, Response, Router } from "express";
import { body, param } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { HydratedDocument } from "mongoose";
import { InvalidPassword } from "../errors/InvalidPassword";
import { ResourceNotAuth } from "../errors/ResourceNotAuth";
import { UserAlreadyExists } from "../errors/UserAlreadyExists";
import { UserDoesNotExist } from "../errors/UserDoesNotExist";
import { IComment } from "../models/Comment";
import { IPost } from "../models/Post";
import { IUser } from "../models/User";
import { AuthService } from "../services/AuthService";
import { CommentService } from "../services/CommentService";
import { PostService } from "../services/PostService";
import { UserService } from "../services/UserService";
import { AuthMiddleware } from "./middleware/AuthMiddleware";
import { getValidatedData, validate } from "./middleware/ValidationMiddleware";

export const ApiController = Router();

ApiController.get(
  "/self",
  AuthMiddleware,
  async (req: Request, res: Response) => {
    const user = res.locals.user as IUser;

    return res.json({ user });
  }
);

ApiController.post(
  "/login",
  validate([
    body("username").trim().isString(),
    body("password").trim().isString(),
  ]),
  async (req: Request, res: Response) => {
    try {
      const { username, password } = getValidatedData(req);
      const user = await UserService.authenticate(username, password);
      const token = await AuthService.generateToken(user);
      return res.json({ token, user });
    } catch (error) {
      if (
        error instanceof InvalidPassword ||
        error instanceof UserDoesNotExist
      ) {
        return res.status(StatusCodes.FORBIDDEN).json({
          message: "Invalid Credentials",
        });
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Server Error",
      });
    }
  }
);

ApiController.post(
  "/register",
  validate([
    body("username").isString().trim(),
    body("password").isString().trim(),
    body("password_confirm").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
  ]),
  async (req: Request, res: Response) => {
    const { username, password } = getValidatedData(req);

    try {
      const user = await UserService.register(username, password);
      const token = await AuthService.generateToken(user);
      return res.json({ token, user });
    } catch (error) {
      if (error instanceof UserAlreadyExists) {
        return res.status(StatusCodes.CONFLICT).json({
          message: "Username is taken",
        });
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Server Error",
      });
    }
  }
);

ApiController.get("/posts", async (req: Request, res: Response) => {
  const posts = await PostService.list();
  return res.json({ posts });
});

ApiController.get(
  "/posts/:post_id",
  validate([param("post_id").isMongoId().trim()]),
  async (req: Request, res: Response) => {
    const { post_id } = getValidatedData(req);
    const post = await PostService.show(post_id);
    return res.json({ post });
  }
);

//Todo handle different post types
ApiController.post(
  "/posts",
  AuthMiddleware,
  validate([
    body("title").isString().trim(),
    body("content_url").isString().trim().optional(),
    body("content_type").isString().trim(),
    body("content_body").isString().trim().optional(),
    body("tags").isArray(),
    body("tags.*").isString().trim(),
  ]),
  async (req: Request, res: Response) => {
    const post_dto = getValidatedData(req);

    try {
      const user = res.locals.user as IUser;

      const post = await PostService.create(
        user,
        post_dto as IPost,
        post_dto.tags
      );
      return res.json({ post });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Server Error",
      });
    }
  }
);

ApiController.patch(
  "/posts/:post_id",
  AuthMiddleware,
  validate([
    param("post_id").isMongoId().trim(),
    body("content_body").isString().trim().optional(),
    body("tags").isArray().optional(),
    body("tags.*").isString().trim(),
  ]),
  async (req: Request, res: Response) => {
    try {
      const { post_id, ...post_dto } = getValidatedData(req);
      const user = res.locals.user as HydratedDocument<IUser>;
      const post = await PostService.edit(post_id, post_dto as IPost, user);
      return res.json({ post });
    } catch (error) {
      if (error instanceof ResourceNotAuth) {
        return res.status(StatusCodes.FORBIDDEN).json({
          message: "Resource not allowed",
        });
      }
      console.log(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Server Error",
      });
    }
  }
);

ApiController.post(
  "/posts/:post_id/comments",
  AuthMiddleware,
  validate([
    param("post_id").isMongoId().trim(),
    body("content").isString().trim(),
  ]),
  async (req: Request, res: Response) => {
    const { post_id, ...comment_dto } = getValidatedData(req);

    try {
      const user = res.locals.user as IUser;
      const comment = await CommentService.addComment(
        post_id,
        user,
        comment_dto as IComment
      );

      return res.json({ comment });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Server Error",
      });
    }
  }
);

ApiController.get(
  "/posts/:post_id/comments",
  validate([param("post_id").isMongoId().trim()]),
  async (req: Request, res: Response) => {
    const { post_id } = getValidatedData(req);

    try {
      const comments = await CommentService.loadCommentsForPost(post_id);

      return res.json({ comments });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Server Error",
      });
    }
  }
);
ApiController.get(
  "/comments/:comment_id",
  validate([param("comment_id").isMongoId().trim()]),
  async (req: Request, res: Response) => {
    const { comment_id } = getValidatedData(req);

    try {
      const comments = await CommentService.loadCommentsForComment(comment_id);

      return res.json({ comments });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Server Error",
      });
    }
  }
);

ApiController.post(
  "/comments/:comment_id",
  AuthMiddleware,
  validate([
    param("comment_id").isMongoId().trim(),
    body("content").isString().trim(),
  ]),
  async (req: Request, res: Response) => {
    const { comment_id, ...comment_dto } = getValidatedData(req);
    const user = res.locals.user as IUser;
    const comment = await CommentService.addChildComment(
      comment_id,
      user,
      comment_dto as IComment
    );

    return res.json({ comment });
  }
);

ApiController.patch(
  "/comments/:comment_id",
  AuthMiddleware,
  validate([
    param("comment_id").isMongoId().trim(),
    body("content_body").isString().trim(),
  ]),
  async (req: Request, res: Response) => {
    const { comment_id, ...comment_dto } = getValidatedData(req);
    const user = res.locals.user as HydratedDocument<IUser>;

    const comment = await CommentService.edit(
      comment_id,
      comment_dto as IComment,
      user
    );

    return res.json({ comment });
  }
);
