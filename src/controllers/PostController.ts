import { Request, Response, Router } from "express";
import { body, query } from "express-validator";
import { getValidatedData, validate } from "./middleware/Validation";
import { StatusCodes } from "http-status-codes";
import { AuthMiddleware } from "./middleware/AuthMiddleware";
import { PostQueryService } from "../services/PostQueryService";
import { data_source } from "../db";
import { CreatePostService } from "../services/CreatePostService";
import { CreateTagService } from "../services/CreateTagService";
import { TagPostService } from "../services/TagPostService";

export const PostController = Router();

const post_query_service = new PostQueryService(data_source);

const create_post_service = new CreatePostService(data_source);

const create_tag_service = new CreateTagService(data_source);

const tag_post_service = new TagPostService(data_source);

PostController.get(
  "/posts",
  AuthMiddleware,
  validate([
    query("page_size").isInt().optional(),
    query("page_number").isInt().optional(),
  ]),
  async (req: Request, res: Response) => {
    const { page_size = 10, page_number = 1 } = getValidatedData(req, {
      includeOptionals: true,
    }) as { page_size: number; page_number: number };

    try {
      const posts = await post_query_service.fetchLatest(
        page_size,
        page_number
      );
      return res.json({ posts });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
);

PostController.post(
  "/posts",
  AuthMiddleware,
  validate([
    body("url").isURL().trim(),
    body("title").isString().trim(),
    body("tags").isArray(),
    body("tags.*").isString(),
  ]),
  async (req: Request, res: Response) => {
    const { url, title, tags } = getValidatedData(req);
    const user = res.locals.user;
    try {
      create_post_service.setUser(user);

      const [post, tag_p] = await Promise.all([
        create_post_service.createPost(title, url),
        tags.map((tag: string) => create_tag_service.upsertTag(tag)),
      ]);

      await tag_post_service.assignTags(post, tag_p);

      return res.json({ post, user });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
);
