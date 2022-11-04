import { Request, Response, Router } from "express";
import { body, param } from "express-validator";
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

ApiController.post(
  "/login",
  validate([
    body("username").trim().isString(),
    body("password").trim().isString(),
  ]),
  async (req: Request, res: Response) => {
    const { username, password } = getValidatedData(req);
    const user = await UserService.authenticate(username, password);
    const token = await AuthService.generateToken(user);
    return res.json({ token, user });
  }
);

ApiController.post(
  "/register",
  validate([
    body("username").trim().isString(),
    body("password").trim().isString(),
    body("password_confirm").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
  ]),
  async (req: Request, res: Response) => {
    const { username, password } = getValidatedData(req);
    const user = await UserService.register(username, password);
    const token = await AuthService.generateToken(user);
    return res.json({ token, user });
  }
);

ApiController.get("/posts", async (req: Request, res: Response) => {
  const posts = await PostService.list();
  return res.json({ posts });
});

ApiController.get(
  "/posts/{post_id}",
  validate([param("post_id").isMongoId().trim()]),
  async (req: Request, res: Response) => {
    const { post_id } = getValidatedData(req);
    const post = await PostService.show(post_id);
    return res.json({ post });
  }
);

ApiController.post(
  "/posts",
  AuthMiddleware,
  validate([
    body("title").isString().trim(),
    body("content_url").isString().trim(),
    body("content_type").isString().trim(),
    body("content_body").isString().trim().optional(),
    body("tags").isArray().optional(),
    body("tags.*").isString().trim(),
  ]),
  async (req: Request, res: Response) => {
    const post_dto = getValidatedData(req);
    const user = res.locals.user as IUser;

    const post = await PostService.create(
      user,
      post_dto as IPost,
      post_dto.tags
    );
    return res.json({ post });
  }
);

ApiController.patch(
  "/posts/{post_id}",
  AuthMiddleware,
  validate([
    param("post_id").isMongoId().trim(),
    body("content_body").isString().trim().optional(),
    body("tags").isArray().optional(),
    body("tags.*").isString().trim(),
  ]),
  async (req: Request, res: Response) => {
    const { post_id, ...post_dto } = getValidatedData(req);

    const post = await PostService.edit(post_id, post_dto as IPost);
    return res.json({ post });
  }
);

ApiController.post(
  "/posts/{post_id}/comments",
  AuthMiddleware,
  validate([
    param("post_id").isMongoId().trim(),
    body("content").isString().trim(),
  ]),
  async (req: Request, res: Response) => {
    const { post_id, ...comment_dto } = getValidatedData(req);
    const user = res.locals.user as IUser;
    const comment = await CommentService.addComment(
      post_id,
      user,
      comment_dto as IComment
    );

    return res.json({ comment });
  }
);

ApiController.post(
  "/comments/{comment_id}",
  AuthMiddleware,
  validate([
    param("post_id").isMongoId().trim(),
    body("content").isString().trim(),
  ]),
  async (req: Request, res: Response) => {
    const { post_id, ...comment_dto } = getValidatedData(req);
    const user = res.locals.user as IUser;
    const comment = await CommentService.addChildComment(
      post_id,
      user,
      comment_dto as IComment
    );

    return res.json({ comment });
  }
);

ApiController.patch(
  "/comments/{comment_id}",
  AuthMiddleware,
  validate([
    param("comment_id").isMongoId().trim(),
    body("content_body").isString().trim(),
  ]),
  async (req: Request, res: Response) => {
    const { comment_id, ...comment_dto } = getValidatedData(req);
    const user = res.locals.user as IUser;

    const comment = await CommentService.edit(
      comment_id,
      comment_dto as IComment,
      user as IUser
    );

    return res.json({ comment });
  }
);
