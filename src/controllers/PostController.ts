import { NextFunction, Request, Response, Router } from "express";
import { body, param, query } from "express-validator";
import { getValidatedData, validate } from "./middleware/Validation";
import { AuthMiddleware } from "./middleware/AuthMiddleware";
import { PostQueryService } from "../services/PostQueryService";
import { PostResource } from "./resources/PostResource";
import { CreatePostService } from "../services/CreatePostService";
import { CommentService } from "../services/CommentService";
import { CommentResource } from "./resources/CommentResource";

export const PostController = Router();

interface PaginatedQuery {
  page_size: number;
  page_number: number;
}

interface CreatePostBody {
  url: string;
  title: string;
  tags: string[];
}

interface CreateCommentBody {
  content: string;
  post_id: number;
}

const paginated_query_validation = [
  query("page_size").isInt().optional(),
  query("page_number").isInt().optional(),
];

PostController.get(
  "/posts",
  validate(paginated_query_validation),
  async (req: Request, res: Response, next: NextFunction) => {
    const { page_size = 10, page_number = 1 } =
      getValidatedData<PaginatedQuery>(req, {
        includeOptionals: true,
      });

    try {
      const post_query_service = new PostQueryService(
        res.app.get("data_source")
      );

      return res.json({
        posts: PostResource.toCollection(
          await post_query_service.fetchLatest(page_size, page_number)
        ),
      });
    } catch (error: any) {
      return next(error);
    }
  }
);

PostController.get(
  "/user/:user_id/posts",
  validate([...paginated_query_validation, param("user_id").isInt()]),
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      page_size = 10,
      page_number = 1,
      user_id,
    } = getValidatedData<PaginatedQuery & { user_id: number }>(req, {
      includeOptionals: true,
    });

    try {
      const post_query_service = new PostQueryService(
        res.app.get("data_source")
      );

      const posts = PostResource.toCollection(
        await post_query_service.fetchLatestByUser(
          page_size,
          page_number,
          user_id
        )
      );
      return res.json({ posts });
    } catch (error) {
      return next(error);
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
  async (req: Request, res: Response, next: NextFunction) => {
    const { url, title, tags } = getValidatedData<CreatePostBody>(req);
    const user = res.locals.user;
    try {
      const create_post_service = new CreatePostService(
        res.app.get("data_source")
      );

      create_post_service.setUser(user);

      const post = await create_post_service.createPost(title, url, tags);

      return res.json({ post: PostResource.toResource(post) });
    } catch (error) {
      return next(error);
    }
  }
);

PostController.post(
  "/posts/:post_id/comments",
  AuthMiddleware,
  validate([param("post_id").isInt(), body("content").isString().trim()]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { post_id, content } = getValidatedData<CreateCommentBody>(req);
    const user = res.locals.user;
    try {
      const comment_service = new CommentService(res.app.get("data_source"));

      comment_service.setUser(user);

      const comment = await comment_service.addComment(content, post_id);

      return res.json({ post: CommentResource.toResource(comment) });
    } catch (error) {
      return next(error);
    }
  }
);

PostController.get(
  "/posts/:post_id/comments",
  validate([param("post_id").isInt(), body("content").isString().trim()]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { post_id, content } = getValidatedData<CreateCommentBody>(req);
    const user = res.locals.user;
    try {
      const comment_service = new CommentService(res.app.get("data_source"));

      comment_service.setUser(user);

      const comments = await comment_service.getComments(post_id);

      return res.json({ post: CommentResource.toCollection(comments) });
    } catch (error) {
      return next(error);
    }
  }
);
