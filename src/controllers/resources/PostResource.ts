import { Post } from "../../entity/Post";
import { TagResource } from "./TagResource";

export class PostResource {
  public static toCollection(posts: Post[]) {
    return posts.map(this.toResource);
  }
  public static toResource(post: Post) {
    return {
      id: post.id,
      title: post.title,
      user_id: post.user_id,
      url: post.url,
      tags: TagResource.toCollection(post.tags),
      created_at: post.created_at,
      update_at: post.update_at,
    };
  }
}
