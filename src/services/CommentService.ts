import { Post } from "../models";
import { Comment, IComment } from "../models/Comment";
import { IUser } from "../models/User";

export class CommentService {
  public static async addComment(
    post_id: string,
    user: IUser,
    comment_dto: IComment
  ) {
    const post = await Post.findById(post_id);

    // TODO check if post exits

    const comment = await Comment.create({
      ...comment_dto,
      user,
    });

    await post?.update({
      $push: { comments: comment },
    });
  }

  public static async addChildComment(
    comment_id: string,
    user: IUser,
    comment_dto: IComment
  ) {
    const parent_comment = await Comment.findById(comment_id);

    const comment = await Comment.create({
      ...comment_dto,
      user,
    });

    await parent_comment?.update({
      $push: { comments: comment },
    });
  }
}
