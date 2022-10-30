import { Comment } from "../../entity/Comment";

export class CommentResource {
  public static toCollection(comments: Comment[]) {
    return comments.map(this.toResource);
  }
  public static toResource(comment: Comment) {
    return {
      id: comment.id,
      content: comment.content,
      user_id: comment.user_id,
      post_id: comment.post_id,
      created_at: comment.created_at,
      update_at: comment.update_at,
    };
  }
}
